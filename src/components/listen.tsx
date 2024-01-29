import React, { useEffect, useState } from 'react';

const Listening = () => {
  const blinkImages = ["./image19.jpg", "./image20.jpg"];
  const [index, setIndex] = useState(0);

  const blinkAnimation = () => {
    const joyBotImage = document.getElementById("JoyBotResmi") as HTMLImageElement | null;

    if (joyBotImage) {
      joyBotImage.src = blinkImages[index];
      setIndex((prevIndex) => (prevIndex + 1) % blinkImages.length);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      blinkAnimation();
    }, index === 0 ? 200 : 3000);

    return () => clearInterval(intervalId);
  }, [index]);

  useEffect(() => {
    blinkAnimation(); // Initial animation
  }, []); // Empty dependency array ensures it runs only once on mount

  return (
    <img
      id="JoyBotResmi"
      alt="JoyBot Image"
    />
  );
};

export default Listening;
