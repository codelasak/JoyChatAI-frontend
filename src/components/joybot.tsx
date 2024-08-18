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

  const handleStop = async (blobUrl: string) => {
    setIsLoading(true);
    setMode("listening");
    console.log("Send Blob to server", blobUrl);

    const myMessage = { sender: "sen", blobUrl };
    const messagesArr = [...messages, myMessage];

    try {
      const response = await fetch(blobUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch blob: ${response.statusText}`);
      }
      const blob = await response.blob();

      if (blob.size === 0) {
        throw new Error("Blob is empty");
      }

      console.log("Blob size:", blob.size, "bytes");
      console.log("Blob type:", blob.type);

      const formData = new FormData();
      formData.append("file", blob, "myFile.wav");

      console.log("Sending FormData to server...");
      const serverResponse = await axios.post("http://127.0.0.1:8000/post-audio", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: 'arraybuffer',
      });

      console.log("Server response:", serverResponse.data);

      if (serverResponse.status === 303) {
        window.location.href = "https://www.youtube.com";
        console.log("Redirect to YouTube");
      } else if (serverResponse.status === 200) {
        const serverBlob = new Blob([serverResponse.data], { type: "audio/mpeg" });
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
      } else {
        console.error("Unexpected response status:", serverResponse.status);
        setIsLoading(false);
        setMode("normal");
      }
    } catch (error) {
      console.error("Error posting audio:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Server responded with:", error.response.status, error.response.data);
        console.error("Full error object:", JSON.stringify(error, null, 2));
      }
      setIsLoading(false);
      setMode("normal");
    }
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
          onStop={handleStop}
          render={({ status, startRecording, stopRecording }) => (
            <div className="mt-2">
              <button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                className="bg-white p-4 rounded-full"
              >
                <RecordIcon
                  classText={status === "recording" ? "animate-pulse text-red-500" : "text-sky-500"}
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

export default Joybot;