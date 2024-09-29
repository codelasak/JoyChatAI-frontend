import React from "react";
import { Link } from 'react-router-dom';
import { Maximize2, Home, ChevronUp, ChevronDown, Camera, Mic, MicOff, RotateCcw } from 'lucide-react';
import Title from "./Title";
import BlinkAnimation from "./blink";
import TalkAnimation from "./talk";
import ListenAnimation from "./listen";
import { useVoiceChat } from "../hooks/useVoiceChat";

const VoiceChat: React.FC = () => {
  const {
    isControlsVisible,
    mode,
    isVADEnabled,
    isWebSocketConnected,
    toggleControlsVisibility,
    toggleFullScreen,
    toggleVAD
  } = useVoiceChat();

  return (
    <div className="w-1000 h-600 flex flex-col justify-between bg-white">
      <div className="fixed center-0 p-6">
        {mode === "normal" && <BlinkAnimation />}
        {mode === "listening" && <ListenAnimation />}
        {mode === "talking" && <TalkAnimation />}
      </div>

      {isControlsVisible && (
        <>
          <div className="fixed bottom-0 left-0 p-6 flex items-center space-x-4">
            <Title setMessages={() => {}} />
            <button onClick={toggleFullScreen} className="bg-white p-2 rounded-full hover:bg-gray-200 transition-colors">
              <Maximize2 size={24} />
            </button>
            <Link to="/" className="bg-white p-2 rounded-full hover:bg-gray-200 transition-colors">
              <Home size={24} />
            </Link>
            <Link to="/detect" className="bg-white p-2 rounded-full hover:bg-gray-200 transition-colors">
              <Camera size={24} />
            </Link>
            <button className="bg-white p-2 rounded-full hover:bg-gray-200 transition-colors">
              <RotateCcw size={24} />
            </button>
            {/* Remove the connectWebSocket button */}
          </div>

          <div className="fixed bottom-0 right-0 p-6">
            <button
              onClick={toggleVAD}
              className={`p-2 rounded-full transition-colors ${
                isVADEnabled 
                  ? "bg-green-500 hover:bg-green-600" 
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {isVADEnabled ? <MicOff size={24} color="white" /> : <Mic size={24} color="white" />}
            </button>
          </div>
        </>
      )}

      <div className="fixed bottom-0 left-0 transform translate-x-4 p-2">
        <button
          onClick={toggleControlsVisibility}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-200 transition-colors"
        >
          {isControlsVisible ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
        </button>
      </div>
    </div>
  );
};

export default VoiceChat;