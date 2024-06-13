// Joybot.tsx

import React, { useState } from "react";
import Title from "./Title";
import axios from "axios";
import { ReactMediaRecorder } from "react-media-recorder";
import RecordIcon from "./RecordIcon";
import BlinkAnimation from "./blink";
import TalkAnimation from "./talk";
import ListenAnimation from "./listen";

const Joybot = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [mode, setMode] = useState("normal");

  const createBlobURL = (data: any) => {
    const blob = new Blob([data], { type: "audio/mpeg" });
    return window.URL.createObjectURL(blob);
  };

  const handleStop = async (blobUrl: string) => {
    setIsLoading(true);
    setMode("listening");
    console.log("Send Blob to server");
  
    const myMessage = { sender: "sen", blobUrl };
    const messagesArr = [...messages, myMessage];
  
    const audio = new Audio();
    audio.src = blobUrl;
  
    // Listen for the loadedmetadata event to get audio duration
    audio.addEventListener("loadedmetadata", () => {
      const audioDuration = audio.duration;
  
      if (audioDuration < 0.1) {
        // If duration is less than 0.1 seconds, handle appropriately (e.g., show an error message)
        console.error("Audio duration is too short. Minimum audio length is 0.1 seconds.");
        setIsLoading(false);
        setMode("normal");
        return;
      }
  
      // Continue with sending the blob to the server
      fetch(blobUrl)
        .then((res) => res.blob())
        .then(async (blob) => {
          const formData = new FormData();
          formData.append("file", blob, "myFile.wav");
  
          try {  


            const response = await axios.post("http://127.0.0.1:8000/post-audio", formData, {
              headers: {
                "Content-Type": "audio/mpeg",
              },
              responseType: "arraybuffer",
            });

             // Check if the status code is 303 (See Other)
          if (response.status === 303) {
            // Manually handle the redirect
            // Manually handle the redirect to YouTube
            window.location.href = "https://www.youtube.com";
            console.log(" redirect to YouTube");
          } else {
            const serverBlob = new Blob([response.data], { type: "audio/mpeg" });
            const serverBlobUrl = window.URL.createObjectURL(serverBlob);
  
            const rachelMessage = { sender: "JoyBot", blobUrl: serverBlobUrl };
            messagesArr.push(rachelMessage);
            setMessages(messagesArr);
  
            setIsLoading(false);
            setMode("playing");
  
            const audioResponse = new Audio();
            audioResponse.src = serverBlobUrl;
            audioResponse.play();
  
            audioResponse.addEventListener("ended", () => {
              setMode("normal");
            });  
          }
          } catch (error) {
            console.error("Error posting audio:", error);
            setIsLoading(false);
          }
        });
    });
  
    // Load the audio to trigger the loadedmetadata event
    audio.load();
  };

  return (
    <div className="w-1000 h-600 flex flex-col justify-between" style={{ backgroundColor: "white" }}>
      <div className="fixed center-0 p-6">
        {mode === "normal" && <BlinkAnimation />}
        {mode === "listening" && <ListenAnimation />}
        {mode === "playing" && <TalkAnimation />}
      </div>

      <div className="fixed bottom-0 left-0 p-6">
        <Title setMessages={setMessages} />
      </div>

      <div className="fixed bottom-0 right-0 p-6">
        <ReactMediaRecorder
          audio
          onStop={(blobUrl: string) => {
            handleStop(blobUrl);
          }}
          render={({ status, startRecording, stopRecording }) => (
            <div className="mt-2">
              <button
                onMouseDown={startRecording}
                onMouseUp={() => {
                  stopRecording();
                }}
                className="bg-white p-4 rounded-full"
              >
                <RecordIcon
                  classText={
                    status === "recording"
                      ? "animate-pulse text-red-500"
                      : "text-sky-500"
                  }
                />
              </button>
              <p className="mt-2 text-white font-light">{status}</p>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default Joybot