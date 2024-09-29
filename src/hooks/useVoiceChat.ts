import { useState, useEffect, useCallback, useRef } from "react";
import { MicVAD } from "@ricky0123/vad-web";
import { createWavBlob, blobToBase64 } from "../components/audioUtils";
import { useWebSocket } from "./useWebSocket";

export const useVoiceChat = () => {
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [mode, setMode] = useState<'normal' | 'listening' | 'talking'>('normal');
  const [vad, setVad] = useState<any>(null);
  const [isVADEnabled, setIsVADEnabled] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const { isConnected, isPlaying, connect, disconnect, sendMessage } = useWebSocket();
  const isProcessingRef = useRef(false);

  useEffect(() => {
    if (isPlaying) {
      setMode('talking');
    } else {
      setMode('normal');
    }
  }, [isPlaying]);

  const initVAD = useCallback(async () => {
    try {
      const myvad = await MicVAD.new({
        onSpeechStart: () => setMode("listening"),
        onSpeechEnd: handleVADStop,
        onVADMisfire: () => setMode("normal"),
        modelURL: "./silero_vad.onnx", 
        workletURL: "./vad.worklet.bundle.min.js",
      });
      setVad(myvad);
      myvad.start();
      connect(); // Connect WebSocket when VAD is initialized
    } catch (error) {
      console.error("Error initializing VAD:", error);
    }
  }, [connect]);

  useEffect(() => {
    if (isVADEnabled && !vad) {
      initVAD();
    } else if (!isVADEnabled && vad) {
      vad.destroy();
      setVad(null);
      setMode("normal");
      disconnect(); // Disconnect WebSocket when VAD is disabled
    }
  }, [isVADEnabled, vad, initVAD, disconnect]);
  const handleVADStop = useCallback(async (audio: Float32Array) => {
    if (isProcessingRef.current || isPlaying) {
      console.log('Still processing previous input or playing response. Ignoring new input.');
      return;
    }

    isProcessingRef.current = true;
    setIsWaitingForResponse(true);
    setMode('listening');

    try {
      const wavBlob = await createWavBlob(audio);

      if (wavBlob.size <= 44) {
        console.log('Audio blob is empty or too small, not sending to server');
        return;
      }

      const base64Audio = await blobToBase64(wavBlob);
      sendMessage(base64Audio);
    } catch (error) {
      console.error('Error in handleVADStop:', error);
    } finally {
      setIsWaitingForResponse(false);
      isProcessingRef.current = false;
    }
  }, [isPlaying, sendMessage]);

  const toggleControlsVisibility = () => setIsControlsVisible(!isControlsVisible);
  const toggleVAD = () => setIsVADEnabled(prev => !prev);
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  return {
    isControlsVisible,
    mode,
    isVADEnabled,
    isWaitingForResponse,
    isFullScreen,
    isWebSocketConnected: isConnected,
    isResponsePlaying: isPlaying,
    toggleControlsVisibility,
    toggleFullScreen,
    toggleVAD,
  };
};
