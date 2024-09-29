import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/home';
import Joybot from './components/voiceChat';
import Park from './components/park';
import Tebrikler from './components/tebrikler';
import Profile from './components/profile';
import EmotionGazeDetector from './components/EmotionGazeDetector';
import AnalysisResults from './components/AnalysisResults';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Joybot />} />
        <Route path="/park" element={<Park />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tebrikler" element={<Tebrikler />} />
        <Route path="/analysis" element={<AnalysisResults />} />
        <Route path="/detect" element={<EmotionGazeDetector />} />
      </Routes>
    </Router>
  );
}

export default App;