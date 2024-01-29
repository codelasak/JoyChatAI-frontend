import React, { useEffect, useState } from 'react';

const talking = () => {
  const talkImages = ["./image21.jpg", "./image22.jpg"];
  const [index, setIndex] = useState(0);

  const talkAnimation = () => {
    const joyBotImage = document.getElementById("JoyBotResmi") as HTMLImageElement | null;

    if (joyBotImage) {
      joyBotImage.src = talkImages[index];
      setIndex((prevIndex) => (prevIndex + 1) % talkImages.length);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
        talkAnimation();
    }, index === 0 ? 130 : 500);

    return () => clearInterval(intervalId);
  }, [index]);

  useEffect(() => {
    talkAnimation(); // Initial animation
  }, []); // Empty dependency array ensures it runs only once on mount

  return (
    <img
      id="JoyBotResmi"
      alt="JoyBot Image"
    />
  );
};

export default talking;
