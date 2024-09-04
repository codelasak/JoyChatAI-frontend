import { useRef, useState } from 'react';

export const useAudioQueue = () => {
  const audioQueue = useRef<string[]>([]);
  const isPlaying = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isResponsePlaying, setIsResponsePlaying] = useState(false);

  const playNextInQueue = () => {
    if (audioQueue.current.length === 0) {
      isPlaying.current = false;
      setIsResponsePlaying(false);
      return;
    }

    isPlaying.current = true;
    const audioUrl = audioQueue.current.shift()!;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    audioRef.current = new Audio(audioUrl);
    audioRef.current.onloadedmetadata = () => {
      setIsResponsePlaying(true);
      audioRef.current?.play().catch(error => {
        console.error('Error playing audio:', error);
        playNextInQueue();
      });
    };
    audioRef.current.onended = () => {
      URL.revokeObjectURL(audioUrl);
      playNextInQueue();
    };
  };

  return { audioQueue, isPlaying, playNextInQueue, isResponsePlaying };
};