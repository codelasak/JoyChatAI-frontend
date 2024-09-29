import { useState, useEffect, useRef, useCallback } from 'react';

const WS_URL = 'ws://127.0.0.1:8000/api/ws';
const RECONNECT_INTERVAL = 3000;

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const audioQueue = useRef<string[]>([]);
  const currentAudio = useRef<AudioBufferSourceNode | null>(null);

  const playAudio = useCallback((audioBuffer: AudioBuffer) => {
    if (!audioContext.current) return;

    setIsPlaying(true);
    currentAudio.current = audioContext.current.createBufferSource();
    currentAudio.current.buffer = audioBuffer;
    currentAudio.current.connect(audioContext.current.destination);
    currentAudio.current.onended = () => {
      setIsPlaying(false);
      currentAudio.current = null;
      if (audioQueue.current.length > 0) {
        const nextChunk = audioQueue.current.shift()!;
        fetch(nextChunk).then(response => response.arrayBuffer()).then(buffer => {
          audioContext.current!.decodeAudioData(buffer, playAudio);
        });
      }
    };
    currentAudio.current.start();
  }, []);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('WebSocket is already connected');
      return;
    }

    console.log('Attempting to connect WebSocket...');
    wsRef.current = new WebSocket(WS_URL);
    
    wsRef.current.onopen = () => {
      console.log('WebSocket connected successfully');
      setIsConnected(true);
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      setTimeout(connect, RECONNECT_INTERVAL);
    };
    
    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.current.onmessage = (event) => {
      if (event.data instanceof Blob) {
        const audioUrl = URL.createObjectURL(event.data);
        audioQueue.current.push(audioUrl);
        if (!isPlaying) {
          playNextInQueue();
        }
      } else {
        console.log('Received message from server:', event.data);
      }
    };
  }, [isPlaying, playAudio]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
      setIsConnected(false);
      console.log('WebSocket disconnected');
    }
  }, []);

  const sendMessage = useCallback((message: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(message);
    } else {
      console.error('WebSocket is not open. Cannot send message.');
    }
  }, []);

  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.data instanceof Blob) {
      const audioUrl = URL.createObjectURL(event.data);
      audioQueue.current.push(audioUrl);
      if (!isPlaying) {
        playNextInQueue();
      }
    } else {
      console.log('Received message:', event.data);
    }
  }, [isPlaying]);

  const playNextInQueue = useCallback(() => {
    if (audioQueue.current.length > 0) {
      setIsPlaying(true);
      const audioUrl = audioQueue.current.shift()!;
      const audio = new Audio(audioUrl);
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        if (audioQueue.current.length > 0) {
          playNextInQueue();
        } else {
          setIsPlaying(false);
        }
      };
      audio.play();
    } else {
      setIsPlaying(false);
    }
  }, []);

  return { isConnected, isPlaying, connect, disconnect, sendMessage };
};
