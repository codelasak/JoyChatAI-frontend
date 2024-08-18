import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/home';
import Joybot from './components/joybot';
import Park from './components/park';
import Tebrikler from './components/tebrikler';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Joybot />} />
        <Route path="/park" element={<Park />} />
        <Route path="/tebrikler" element={<Tebrikler />} />
      </Routes>
    </Router>
  );
}

export default App;