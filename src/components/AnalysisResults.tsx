import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface WordFrequency {
  [word: string]: number;
}

interface AnalysisResultsProps {
  results: {
    word_count: number;
    word_frequency: WordFrequency;
    sentiment: string;
  };
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results }) => {
  const { word_count, word_frequency, sentiment } = results;

  const wordFrequencyData = Object.entries(word_frequency).map(([name, value]) => ({ name, value }));

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Chat Analysis</h2>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Word Analysis</h3>
        <p className="mb-2">Total words: {word_count}</p>
        <h4 className="text-lg font-medium mb-2">Most frequent words:</h4>
        <BarChart width={300} height={200} data={wordFrequencyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#82ca9d" />
        </BarChart>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Sentiment Analysis</h3>
        <p className="text-lg">Overall sentiment: <strong>{sentiment}</strong></p>
      </div>
    </div>
  );
};

export default AnalysisResults;