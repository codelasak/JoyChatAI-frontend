import { useState } from "react";
import { ReactMediaRecorder } from "react-media-recorder";
import RecordIcon from "./RecordIcon";
import axios from "axios";

type Props = {
  handleStop: (blobUrl: string) => void;
};

const RecordMessage: React.FC<Props> = ({ handleStop }) => {
  const [latestBlobUrl, setLatestBlobUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sendBlobToServer = async (blobUrl: string) => {
    setIsLoading(true);
    console.log("Send Blob to server");

    // convert blob url to blob object
    const blobResponse = await fetch(blobUrl);
    const blob = await blobResponse.blob();

    // Construct audio to send file
    const formData = new FormData();
    formData.append("file", blob, "myFile.wav");

    // send form data to the API endpoint
    try {
      const response = await axios.post("http://127.0.0.1:8000/post-audio", formData, {
        headers: {
          "Content-Type": "audio/wav", // Adjust content type if needed
        },
        responseType: "arraybuffer",
      });

      const serverBlob = new Blob([response.data], { type: "audio/wav" });
      const serverBlobUrl = window.URL.createObjectURL(serverBlob);

      // Notify the parent component about the blob URL
      handleStop(serverBlobUrl);
    } catch (error) {
      console.error("Error posting audio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ReactMediaRecorder
      audio
      onStop={(blobUrl: string) => {
        setLatestBlobUrl(blobUrl);
        // If you only want to send the blob to the server when recording stops,
        // you can call sendBlobToServer here.
        // sendBlobToServer(blobUrl);
      }}
      render={({ status, startRecording, stopRecording }) => (
        <div className="mt-2">
          <button
            onMouseDown={startRecording}
            onMouseUp={() => {
              stopRecording();
              if (latestBlobUrl) {
                sendBlobToServer(latestBlobUrl);
              }
            }}
            className="bg-white p-4 rounded-full"
          >
            <RecordIcon
              classText={
                status === "recording"
                  ? "animate-pulse text-red-500"
                  : "text-sky-500"
              }
            />
          </button>
          <p className="mt-2 text-white font-light">{status}</p>
        </div>
      )}
    />
  );
};

export default RecordMessage;

