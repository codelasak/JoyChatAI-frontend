import React from 'react';
import { Link } from 'react-router-dom';
import { Home as HomeIcon, Maximize2, MessageCircle, User } from 'lucide-react';

const Home: React.FC = () => {
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                <HomeIcon className="h-6 w-6" />
              </Link>
              <Maximize2 className="h-6 w-6 ml-2 cursor-pointer" onClick={toggleFullScreen} />
              <Link to="/profile" className="ml-2">
                <User className="h-6 w-6 text-gray-600 hover:text-gray-900" />
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Merhaba</h1>
            <Link to="/chat" className="text-gray-600 hover:text-gray-900">
              <MessageCircle className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Replikli Öğretim</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/park" className="space-y-2 text-center">
            <img src="/replik/Park.jpg" alt="Park" className="w-full h-64 object-cover rounded-lg shadow-md" />
            <h3 className="text-lg font-semibold text-gray-900">Park</h3>
          </Link>
          <div className="space-y-2 text-center">
            <img src="/replik/Cats.jpg" alt="cats" className="w-full h-64 object-cover rounded-lg shadow-md" />
            <h3 className="text-lg font-semibold text-gray-900">Kedi</h3>
          </div>
          <div className="space-y-2 text-center">
            <img src="/replik/Sleep.jpg" alt="sleep_rotunine" className="w-full h-64 object-cover rounded-lg shadow-md" />
            <h3 className="text-lg font-semibold text-gray-900">Uyku Rutini</h3>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;