import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Merhaba</h1>
            <Link to="/chat" className="text-gray-600 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </Link>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Replikli Öğretim</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/park" className="space-y-2 text-center">
            <img src="./dist/park.jpg" alt="Park" className="w-full h-64 object-cover rounded-lg shadow-md" />
            <h3 className="text-lg font-semibold text-gray-900">Park</h3>
          </Link>
          <div className="space-y-2 text-center">
            <img src="./dist/Cats.jpg" alt="cats" className="w-full h-64 object-cover rounded-lg shadow-md" />
            <h3 className="text-lg font-semibold text-gray-900">Kedi</h3>
          </div>
          <div className="space-y-2 text-center">
            <img src="./dist/sleep.jpg" alt="sleep_rotunine" className="w-full h-64 object-cover rounded-lg shadow-md" />
            <h3 className="text-lg font-semibold text-gray-900">Uyku Rutini</h3>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;