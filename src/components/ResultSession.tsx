import React from 'react';
import { BarChart2, Smile } from 'lucide-react';

interface ResultSessionProps {
  emotion: string | null;
  analysisResult: {
    avg_sentence_length: number;
    most_common_words: [string, number][];
  } | null;
}

const ResultSession: React.FC<ResultSessionProps> = ({ emotion, analysisResult }) => {
  return (
    <div className="fixed top-4 right-4 p-4 bg-white shadow-md rounded-lg max-w-sm">
      {emotion && (
        <div className="mb-4">
          <h3 className="flex items-center mb-2 text-lg font-semibold">
            <Smile className="mr-2" /> Detected Emotion
          </h3>
          <p className="text-gray-700">{emotion}</p>
        </div>
      )}
      {analysisResult && (
        <div>
          <h3 className="flex items-center mb-2 text-lg font-semibold">
            <BarChart2 className="mr-2" /> Chat Analysis
          </h3>
          <p className="text-gray-700">Avg Sentence Length: {analysisResult.avg_sentence_length.toFixed(1)}</p>
          <p className="text-gray-700">
            Most Common Words: {analysisResult.most_common_words.slice(0, 3).map(([word, _]) => word).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default ResultSession;