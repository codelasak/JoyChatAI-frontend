import { useState, useEffect, useRef, useCallback } from "react";
import { MicVAD } from "@ricky0123/vad-web";
import { useAudioQueue } from "./useAudioQueue";
import { sendAudioToServer, createWavBlob } from "./audioUtils";

export const useVoiceChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [mode, setMode] = useState<'normal' | 'listening' | 'playing'>('normal');
  const [vad, setVad] = useState<any>(null);
  const [isVADEnabled, setIsVADEnabled] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const { audioQueue, isPlaying, playNextInQueue, isResponsePlaying } = useAudioQueue();

  useEffect(() => {
    console.log('Animation state changed:', mode);
  }, [mode]);

  useEffect(() => {
    console.log('isLoading changed:', isLoading);
  }, [isLoading]);

  const handleVADStateChange = useCallback(() => {
    if (vad) {
      if (isWaitingForResponse || isResponsePlaying) {
        vad.pause();
      } else if (isVADEnabled) {
        vad.start();
      } else {
        vad.pause();
      }
    }
  }, [isWaitingForResponse, isResponsePlaying, vad, isVADEnabled]);

  useEffect(() => {
    handleVADStateChange();
  }, [handleVADStateChange]);

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
    } catch (error) {
      console.error("Error initializing VAD:", error);
    }
  }, []);

  useEffect(() => {
    if (isVADEnabled && !vad) {
      initVAD();
    } else if (!isVADEnabled && vad) {
      vad.destroy();
      setVad(null);
      setMode("normal");
    }
  }, [isVADEnabled, vad, initVAD]);

  const handleVADStop = useCallback(async (audio: Float32Array) => {
    if (isWaitingForResponse || isResponsePlaying) {
      console.log('Still processing previous input or playing response. Ignoring new input.');
      return;
    }
    setIsWaitingForResponse(true);
    setIsLoading(true);
    setMode('listening');

    const wavBlob = await createWavBlob(audio);

    if (wavBlob.size <= 44) {
      console.log('Audio blob is empty or too small, not sending to server');
      setIsLoading(false);
      setIsWaitingForResponse(false);
      setMode("normal");
      return;
    }

    try {
      const audioUrl = await sendAudioToServer(wavBlob);
      audioQueue.current.push(audioUrl);
      if (!isPlaying.current) {
        playNextInQueue();
      }
    } catch (error) {
      console.error('Error in handleVADStop:', error);
    } finally {
      setIsLoading(false);
      setIsWaitingForResponse(false);
      setMode("normal");  // Reset mode after processing
    }
  }, [isWaitingForResponse, isResponsePlaying, audioQueue, isPlaying, playNextInQueue]);

  const toggleControlsVisibility = () => setIsControlsVisible(!isControlsVisible);
  
  const toggleVAD = useCallback(() => {
    setIsVADEnabled(prev => !prev);
  }, []);

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
    toggleControlsVisibility,
    toggleFullScreen,
    toggleVAD,
    setMessages,
    isResponsePlaying
  };
};