import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Smile, EyeIcon, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

interface DetectionResult {
  emotion: string | null;
  confidence: number | null;
  gaze_direction: string | null;
  gaze_times: {
    left: number;
    center: number;
    right: number;
  };
}

const EmotionGazeDetector: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let interval: NodeJS.Timeout | null = null;

    const startWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError(`Kamera erişim hatası: ${err instanceof Error ? err.message : String(err)}`);
      }
    };

    const captureAndSendFrame = async () => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d')?.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg');
        
        try {
          const response = await axios.post<DetectionResult>('http://127.0.0.1:8000/api/detect-emotion-and-gaze', {
            image: imageData
          });
          setDetectionResult(response.data);
        } catch (err) {
          setError(`Kare gönderme hatası: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    };

    startWebcam();
    interval = setInterval(captureAndSendFrame, 1000); // Her saniye bir kare gönder

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  const resetGazeTimes = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/reset-gaze-times');
      setDetectionResult(prevState => 
        prevState ? {...prevState, gaze_times: {left: 0, center: 0, right: 0}} : null
      );
    } catch (err) {
      setError(`Bakış sürelerini sıfırlama hatası: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const getEmotionColor = (emotion: string | null) => {
    switch (emotion) {
      case 'happy': return 'text-yellow-500';
      case 'sad': return 'text-blue-500';
      case 'angry': return 'text-red-500';
      case 'surprised': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  const getGazeIcon = (direction: string | null) => {
    switch (direction) {
      case 'left': return <ArrowLeft className="w-6 h-6 mr-2" />;
      case 'right': return <ArrowRight className="w-6 h-6 mr-2" />;
      default: return <EyeIcon className="w-6 h-6 mr-2" />;
    }
  };

  const translateEmotion = (emotion: string | null) => {
    switch (emotion) {
      case 'happy': return 'Mutlu';
      case 'sad': return 'Üzgün';
      case 'angry': return 'Kızgın';
      case 'surprised': return 'Şaşkın';
      default: return 'Nötr';
    }
  };

  const translateGazeDirection = (direction: string | null) => {
    switch (direction) {
      case 'left': return 'Sol';
      case 'right': return 'Sağ';
      case 'center': return 'Merkez';
      default: return 'Bilinmiyor';
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="container mx-auto p-4 relative">
      <button
        onClick={handleGoBack}
        className="absolute top-4 left-4 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300 flex items-center"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Geri Git
      </button>

      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Duygu ve Bakış Detektörü</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/2">
          <video ref={videoRef} autoPlay className="w-full rounded-lg shadow-md" />
          <canvas ref={canvasRef} className="hidden" />
        </div>
        <div className="md:w-1/2">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
              <p>{error}</p>
            </div>
          )}
          {detectionResult && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-gray-100 p-4 rounded-md">
                <div className="flex items-center">
                  <Smile className={`w-8 h-8 mr-3 ${getEmotionColor(detectionResult.emotion)}`} />
                  <div>
                    <p className="font-semibold">Duygu</p>
                    <p className="text-lg capitalize">{translateEmotion(detectionResult.emotion)}</p>
                  </div>
                </div>
                <p className="text-lg font-semibold">
                  Doğruluk: %{detectionResult.confidence?.toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-md">
                <p className="font-semibold mb-2">Bakış Yönü</p>
                <p className="text-lg flex items-center capitalize">
                  {getGazeIcon(detectionResult.gaze_direction)}
                  {translateGazeDirection(detectionResult.gaze_direction)}
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-md">
                <p className="font-semibold mb-2">Bakış Süreleri</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-blue-100 p-2 rounded">
                    <p className="font-medium">Sol</p>
                    <p>{detectionResult.gaze_times.left.toFixed(2)}s</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded">
                    <p className="font-medium">Merkez</p>
                    <p>{detectionResult.gaze_times.center.toFixed(2)}s</p>
                  </div>
                  <div className="bg-yellow-100 p-2 rounded">
                    <p className="font-medium">Sağ</p>
                    <p>{detectionResult.gaze_times.right.toFixed(2)}s</p>
                  </div>
                </div>
              </div>
              <button
                onClick={resetGazeTimes}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Bakış Sürelerini Sıfırla
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmotionGazeDetector;