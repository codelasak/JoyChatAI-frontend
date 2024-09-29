import { useState, useEffect, useRef, useCallback } from "react";
import { MicVAD } from "@ricky0123/vad-web";
import { useAudioQueue } from "./useAudioQueue";
import { createWavBlob, blobToBase64 } from "./audioUtils";

export const useVoiceChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [mode, setMode] = useState<'normal' | 'listening' | 'playing'>('normal');
  const [vad, setVad] = useState<any>(null);
  const [isVADEnabled, setIsVADEnabled] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { audioQueue, isPlaying, playNextInQueue, isResponsePlaying } = useAudioQueue();

  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('WebSocket is already connected');
      return;
    }

    console.log('Attempting to connect WebSocket...');
    wsRef.current = new WebSocket('ws://127.0.0.1:8000/api/ws');
    
    wsRef.current.onopen = () => {
      console.log('WebSocket connected successfully');
      setIsWebSocketConnected(true);
      reconnectAttempts.current = 0;
    };

    wsRef.current.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      setIsWebSocketConnected(false);
      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttempts.current += 1;
          console.log(`Attempting to reconnect (attempt ${reconnectAttempts.current})...`);
          connectWebSocket();
        }, 3000);
      } else {
        console.log('Max reconnect attempts reached. Please refresh the page.');
      }
    };
    
    wsRef.current.onmessage = (event) => {
      console.log('Received WebSocket message:', event.data);
      if (event.data instanceof Blob) {
        const audioUrl = URL.createObjectURL(event.data);
        audioQueue.current.push(audioUrl);
        if (!isPlaying.current) {
          playNextInQueue();
        }
      } else {
        console.log('Received message:', event.data);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      // Attempt to reconnect
      setTimeout(() => {
        console.log('Attempting to reconnect due to error...');
        connectWebSocket();
      }, 5000);
    };
  }, []);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connectWebSocket]);

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
        modelURL: './silero_vad.onnx',
        workletURL: './vad.worklet.bundle.min.js',
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
      const base64Audio = await blobToBase64(wavBlob);
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(base64Audio);
      } else {
        console.error('WebSocket is not open');
        connectWebSocket(); // Attempt to reconnect
      }
    } catch (error) {
      console.error('Error in handleVADStop:', error);
    } finally {
      setIsLoading(false);
      setIsWaitingForResponse(false);
      setMode("normal");
    }
  }, [isWaitingForResponse, isResponsePlaying, connectWebSocket]);

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
    isLoading,
    isWaitingForResponse,
    isFullScreen,
    messages,
    isWebSocketConnected,
    toggleControlsVisibility,
    toggleFullScreen,
    toggleVAD,
    setMessages,
    isResponsePlaying,
    connectWebSocket // Add this to the returned object
  };
};