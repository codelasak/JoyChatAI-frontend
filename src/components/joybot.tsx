import { useState, useEffect } from "react";
import Title from "./Title";
import axios from "axios";
import RecordMessage from "./RecordMessage";
import BlinkAnimation from "./blink";
import TalkAnimation from "./talk";
import ListenAnimation from "./listen";



const Joybot = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [mode, setMode] = useState("normal"); // Added mode state

  function createBlobURL(data: any) {
    const blob = new Blob([data], { type: "audio/wav" });
    const url = window.URL.createObjectURL(blob);
    return url;
  }

  const handleStop = async (blobUrl: string) => {
    setIsLoading(true);
    setMode("listening"); // Switch to listening mode when recording is enabled

    // Append recorded message to messages
    const myMessage = { sender: "sen", blobUrl };
    const messagesArr = [...messages, myMessage];

    // convert blob url to blob object
    fetch(blobUrl)
      .then((res) => res.blob())
      .then(async (blob) => {
        // Construct audio to send file
        const formData = new FormData();
        formData.append("file", blob, "myFile.wav");

        // send form data to api endpoint
        await axios // http://127.0.0.1:8000/post-audio //https://joyai-backend.onrender.com/post-audio
          .post("https://joyai-backend.onrender.com/post-audio", formData, { 
            headers: {
              "Content-Type": "audio/wav",
            },
            responseType: "arraybuffer", // Set the response type to handle binary data
          })
          .then((res: any) => {
            const blob = res.data;
            const audio = new Audio();
            audio.src = createBlobURL(blob);

            // Append to audio
            const rachelMessage = { sender: "JoyBot", blobUrl: audio.src };
            messagesArr.push(rachelMessage);
            setMessages(messagesArr);

            // Play audio
            setIsLoading(false);
            setMode("playing"); // Switch to playing mode when audio is playing
            audio.play();
            
            audio.addEventListener("ended", () => {
                setMode("normal");
              });
          })
          .catch((err: any) => {
            console.error(err);
            setIsLoading(false);
          });
      });
  };
  return (
    <div className="w-1000 h-600 flex flex-col justify-between">
    
      {/* Image */}
      <div className="fixed center-0 p-6">
        {mode === "normal" && <BlinkAnimation />}
        {mode === "listening" && <ListenAnimation />}
        {mode === "playing" && <TalkAnimation />}
      </div>
      
       {/* Title */}
      <div className="fixed bottom-0 left-0 p-6">
      <Title setMessages={setMessages} />

      </div>

        {/* Recorder */}
        <div className="fixed bottom-0 right-0 p-6">
          <RecordMessage handleStop={handleStop} />
        </div> 
    </div>
    
    
  );
};

export default Joybot;
