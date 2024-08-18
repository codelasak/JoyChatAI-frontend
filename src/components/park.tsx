import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TalkAnimation from './talk';
import ListenAnimation from './listen';

const Park: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();
  const [animationState, setAnimationState] = useState<'listen' | 'talk' | 'none'>('none');

  const steps = [
    { talkAudio: './voices/Parkta_kaydırak_var_.mp3', image: './replik/Park1.jpg', replyAudio: './voices/replik_Kaydıraktan__kayarım_.mp3' },
    { talkAudio: './voices/Kaydırak_çok_güzel_.mp3', image: './replik/Park2.jpg', replyAudio: './voices/replik_Parkta__top__oynarım_.mp3' },
    { talkAudio: './voices/Top_oynamak_eğlencelidir_.mp3', image: './replik/Park3.jpg', replyAudio: './voices/replik_Arkadaşlarım__da__parka_gider_.mp3' },
    { talkAudio: './voices/Herkes_parkta_eğleniyor_.mp3', image: './replik/Park4.jpg', replyAudio: './voices/replik_Arkadaşlarımla__oynarken__mutluyum_.mp3', finalAudio: './voices/Arkadaşlarımızı_çok_severiz_.mp3' },
  ];

  useEffect(() => {
    playStep();
  }, [currentStep]);

  const playStep = () => {
    setIsPlaying(true);
    setShowImage(false);

    // Start with ListenAnimation
    setAnimationState('listen');
    setTimeout(() => {
      setAnimationState('talk');
      audioRef.current = new Audio(steps[currentStep].talkAudio);
      audioRef.current.onended = () => {
        // Switch back to ListenAnimation after talk
        setAnimationState('listen');
        setTimeout(() => {
          setAnimationState('none');
          setIsPlaying(false);
          setShowImage(true);
          // Add a 3-second delay before playing the reply audio
          setTimeout(playReplyAudio, 3000);
        }, 1500);
      };
      audioRef.current.play();
    }, 1500);
  };

  const playReplyAudio = () => {
    const replyAudio = new Audio(steps[currentStep].replyAudio);
    replyAudio.onended = () => {
      if (currentStep === steps.length - 1 && steps[currentStep].finalAudio) {
        playFinalAudio();
      }
    };
    replyAudio.play();
  };

  const playFinalAudio = () => {
    setIsPlaying(true);
    setShowImage(false);
    setAnimationState('talk'); // Start TalkAnimation

    const finalAudio = new Audio(steps[currentStep].finalAudio!);
    finalAudio.onended = () => {
      setAnimationState('none'); // Stop animation
      setIsPlaying(false);
      setShowImage(true);
      // Navigate to Tebrikler component after a short delay
      setTimeout(() => navigate('/tebrikler'), 100);
    };
    finalAudio.play();
  };

  const handleNextClick = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="flex flex-col items-center justify-center h-screen">
        {isPlaying && (
          <div className="w-full h-full flex items-center justify-center">
            {animationState === 'listen' && <ListenAnimation />}
            {animationState === 'talk' && <TalkAnimation />}
          </div>
        )}
        {showImage && (
          <div className="flex flex-col items-center">
            <img src={steps[currentStep].image} alt={`Park ${currentStep + 1}`} className="max-w-full h-auto rounded-lg" />
            {currentStep < steps.length - 1 && (
              <button onClick={handleNextClick} className="mt-4 p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Park;