import React, { useState, useEffect, useRef } from "react";
import Title from "./Title";
import BlinkAnimation from "./blink";
import TalkAnimation from "./talk";
import ListenAnimation from "./listen";
import { MicVAD } from "@ricky0123/vad-web";

const Joybot = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [mode, setMode] = useState<'normal' | 'listening' | 'playing'>('normal');
  const [vad, setVad] = useState<any>(null);
  const [isVADEnabled, setIsVADEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isResponsePlaying, setIsResponsePlaying] = useState(false);

  useEffect(() => {
    console.log('Animation state changed:', mode);
  }, [mode]);

  useEffect(() => {
    console.log('isPlaying changed:', isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (isResponsePlaying && vad) {
      vad.pause();
    } else if (!isResponsePlaying && vad && isVADEnabled) {
      vad.start();
    }
  }, [isResponsePlaying, vad, isVADEnabled]);

  const initVAD = async () => {
    try {
      const myvad = await MicVAD.new({
        onSpeechStart: () => setMode("listening"),
        onSpeechEnd: handleVADStop,
        onVADMisfire: () => setMode("normal"),
        modelURL: "/silero_vad.onnx",
        workletURL: "/vad.worklet.bundle.min.js",
      });
      setVad(myvad);
      myvad.start();
    } catch (error) {
      console.error("Error initializing VAD:", error);
    }
  };

  useEffect(() => {
    if (isVADEnabled && !vad) {
      initVAD();
    } else if (!isVADEnabled && vad) {
      vad.destroy();
      setVad(null);
      setMode("normal");
    }
  }, [isVADEnabled]);

  const handleVADStop = async (audio: Float32Array) => {
    setIsLoading(true);
    setMode('listening');

    // Convert Float32Array to Int16Array
    const int16Array = new Int16Array(audio.length);
    for (let i = 0; i < audio.length; i++) {
      const s = Math.max(-1, Math.min(1, audio[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }

    // Create WAV header
    const wavHeader = createWavHeader(int16Array.length, 1, 16000, 16);

    // Combine header and audio data
    const wavBlob = new Blob([wavHeader, int16Array], { type: 'audio/wav' });
    
    console.log('Audio blob size:', wavBlob.size, 'bytes');
    console.log('Audio blob type:', wavBlob.type);

    // Check if the blob is empty (or very small)
    if (wavBlob.size <= 44) {
      console.log('Audio blob is empty or too small, not sending to server');
      setIsLoading(false);
      setMode("normal");
      return;
    }

    // Send audio to server
    try {
      await sendAudioToServer(wavBlob);
    } catch (error) {
      console.error('Error in handleVADStop:', error);
    }

    setMode('playing');

    if (audioRef.current) {
      audioRef.current.onended = () => {
        setIsResponsePlaying(false);
        setMode('normal');
      };
      await audioRef.current.play();
    }

    setIsLoading(false);
  };

  const toggleVAD = () => {
    setIsVADEnabled(!isVADEnabled);
  };

  async function sendAudioToServer(audioBlob: Blob) {
    if (audioBlob.size <= 44) {
      console.log('Audio blob is empty or too small, not sending to server');
      return;
    }

    const formData = new FormData();
    formData.append('file', audioBlob, 'recorded_audio.wav');

    try {
      const response = await fetch('https://api.fennaver.com/post-audio/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', response.status, errorText);
        throw new Error(`Server response was not ok: ${response.status} ${errorText}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => {
        setIsResponsePlaying(false);
        setMode('normal');
      };

      setIsResponsePlaying(true);
      await audioRef.current.play();

      console.log('Audio response received and playing');
    } catch (error) {
      console.error('Error sending audio to server:', error);
      setIsResponsePlaying(false);
      setMode("normal");
    }
  }

  useEffect(() => {
    const img1 = new Image();
    const img2 = new Image();
    img1.onload = () => console.log("image21.jpg loaded successfully");
    img1.onerror = () => console.error("Failed to load image21.jpg");
    img2.onload = () => console.log("image22.jpg loaded successfully");
    img2.onerror = () => console.error("Failed to load image22.jpg");
    img1.src = "./image21.jpg";
    img2.src = "./image22.jpg";
  }, []);

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
        <button
          onClick={toggleVAD}
          className={`bg-white p-4 rounded-full ${isVADEnabled ? "bg-green-500" : "bg-red-500"}`}
        >
          {isVADEnabled ? "Kapat" : "Başlat"}
        </button>
      </div>

      {/* Debug information 

      <div className="fixed top-0 left-0 p-2 bg-white text-black">
        Animation State: {mode}
      </div>
      */}
    </div>
    
  );
};

// Add this function to create a WAV header
function createWavHeader(dataLength: number, numChannels: number, sampleRate: number, bitsPerSample: number) {
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // file length minus RIFF identifier length and file description length
  view.setUint32(4, 36 + dataLength * 2, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // format chunk identifier
  writeString(view, 12, 'fmt ');
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (raw)
  view.setUint16(20, 1, true);
  // channel count
  view.setUint16(22, numChannels, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sample rate * block align)
  view.setUint32(28, sampleRate * 4, true);
  // block align (channel count * bytes per sample)
  view.setUint16(32, numChannels * 2, true);
  // bits per sample
  view.setUint16(34, bitsPerSample, true);
  // data chunk identifier
  writeString(view, 36, 'data');
  // data chunk length
  view.setUint32(40, dataLength * 2, true);

  return buffer;
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

export default Joybot;