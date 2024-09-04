import React from "react";
import { Link } from 'react-router-dom';
import { Maximize2, Home, ChevronUp, ChevronDown } from 'lucide-react';
import Title from "./Title";
import BlinkAnimation from "./blink";
import TalkAnimation from "./talk";
import ListenAnimation from "./listen";
import { useVoiceChat } from "./useVoiceChat";

const VoiceChat: React.FC = () => {
  const {
    isControlsVisible,
    mode,
    isVADEnabled,
    isResponsePlaying,
    toggleControlsVisibility,
    toggleFullScreen,
    toggleVAD,
    setMessages
  } = useVoiceChat();

  return (
    <div className="w-1000 h-600 flex flex-col justify-between bg-white">
      <div className="fixed center-0 p-6">
        {mode === "normal" && !isResponsePlaying && <BlinkAnimation />}
        {mode === "listening" && <ListenAnimation />}
        {(mode === "playing" || isResponsePlaying) && <TalkAnimation />}
      </div>

      {isControlsVisible && (
        <>
          <div className="fixed bottom-0 left-0 p-6 flex items-center space-x-4">
            <Title setMessages={setMessages} />
            <button onClick={toggleFullScreen} className="bg-white p-2 rounded-full">
              <Maximize2 size={24} />
            </button>
            <Link to="/" className="bg-white p-2 rounded-full">
              <Home size={24} />
            </Link>
          </div>

          <div className="fixed bottom-0 right-0 p-6">
            <button
              onClick={toggleVAD}
              className={`bg-white p-4 rounded-full ${isVADEnabled ? "bg-green-500" : "bg-red-500"}`}
            >
              {isVADEnabled ? "Kapat" : "Başlat"}
            </button>
          </div>
        </>
      )}

      <div className="fixed bottom-0 left-0 transform translate-x-4 p-2">
        <button
          onClick={toggleControlsVisibility}
          className="bg-white p-2 rounded-full shadow-md"
        >
          {isControlsVisible ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
        </button>
      </div>
    </div>
  );
};

export default VoiceChat;