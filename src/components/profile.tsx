import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, Star, Edit2, Check, X, Plus, Trash2, Heart, Music, Palette, Coffee } from 'lucide-react';

interface ProfileInfo {
  id: string;
  name: string;
  age: number;
  level: string;
  avatar: string;
  hobbies: string[];
  interests: string[];
  favoriteColors: string[];
  favoriteFoods: string[];
}

const initialProfiles: ProfileInfo[] = [
  {
    id: '1', name: 'Ahmet', age: 8, level: 'Başlangıç', avatar: '👦',
    hobbies: ['Futbol', 'Resim'], interests: ['Uzay', 'Dinozorlar'],
    favoriteColors: ['Mavi', 'Yeşil'], favoriteFoods: ['Pizza', 'Dondurma']
  },
  {
    id: '2', name: 'Abdullah', age: 6, level: 'Orta', avatar: '👨',
    hobbies: ['Yüzme', 'Lego'], interests: ['Hayvanlar', 'Arabalar'],
    favoriteColors: ['Kırmızı', 'Sarı'], favoriteFoods: ['Makarna', 'Çikolata']
  },
  {
    id: '3', name: 'Aslı', age: 5, level: 'İleri', avatar: '👧',
    hobbies: ['Dans', 'Boyama'], interests: ['Müzik', 'Çizgi filmler'],
    favoriteColors: ['Mor', 'Pembe'], favoriteFoods: ['Meyve', 'Kurabiye']
  },
  {
    id: '4', name: 'Ali', age: 4, level: 'Başlangıç', avatar: '👶',
    hobbies: ['Top oynama', 'Saklambaç'], interests: ['Böcekler', 'Çizgi film karakterleri'],
    favoriteColors: ['Turuncu', 'Mavi'], favoriteFoods: ['Köfte', 'Patates kızartması']
  }
];

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<ProfileInfo[]>(initialProfiles);
  const [selectedProfile, setSelectedProfile] = useState<ProfileInfo>(profiles[0]);
  const [editing, setEditing] = useState<keyof ProfileInfo | null>(null);
  const [tempValue, setTempValue] = useState<string>('');

  const handleEdit = (field: keyof ProfileInfo) => {
    setEditing(field);
    setTempValue(
      Array.isArray(selectedProfile[field])
        ? (selectedProfile[field] as string[]).join(', ')
        : String(selectedProfile[field])
    );
  };

  const handleSave = () => {
    if (editing) {
      let updatedValue: string | number | string[];
      if (Array.isArray(selectedProfile[editing])) {
        updatedValue = tempValue.split(',').map(item => item.trim());
      } else if (editing === 'age') {
        updatedValue = parseInt(tempValue, 10) || selectedProfile.age;
      } else {
        updatedValue = tempValue;
      }

      const updatedProfile = {
        ...selectedProfile,
        [editing]: updatedValue
      };
      setSelectedProfile(updatedProfile);
      setProfiles(profiles.map(p => p.id === updatedProfile.id ? updatedProfile : p));
      setEditing(null);
    }
  };

  const handleCancel = () => {
    setEditing(null);
  };

  const handleAddProfile = () => {
    const newProfile: ProfileInfo = {
      id: Date.now().toString(),
      name: 'Yeni Kullanıcı',
      age: 0,
      level: 'Başlangıç',
      avatar: '😊',
      hobbies: [],
      interests: [],
      favoriteColors: [],
      favoriteFoods: []
    };
    setProfiles([...profiles, newProfile]);
    setSelectedProfile(newProfile);
  };

  const handleRemoveProfile = (id: string) => {
    const updatedProfiles = profiles.filter(p => p.id !== id);
    setProfiles(updatedProfiles);
    if (selectedProfile.id === id) {
      setSelectedProfile(updatedProfiles[0] || null);
    }
  };

  const handleViewAnalysis = () => {
    navigate('/analysis', { state: { selectedProfile } });
  };

  const renderField = (field: keyof ProfileInfo, label: string, icon: React.ReactNode) => (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-full">
            {icon}
          </div>
          <div>
            <p className="text-sm text-gray-500">{label}</p>
            {editing === field ? (
              <input
                type={field === 'age' ? 'number' : 'text'}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="font-semibold">
                {Array.isArray(selectedProfile[field])
                  ? (selectedProfile[field] as string[]).join(', ')
                  : String(selectedProfile[field])}
              </p>
            )}
          </div>
        </div>
        {editing === field ? (
          <div className="space-x-2">
            <button onClick={handleSave} className="text-green-600 hover:text-green-800 transition-colors duration-200">
              <Check className="h-5 w-5" />
            </button>
            <button onClick={handleCancel} className="text-red-600 hover:text-red-800 transition-colors duration-200">
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <button onClick={() => handleEdit(field)} className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
            <Edit2 className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-gray-600 hover:text-gray-900 flex items-center">
              <ArrowLeft className="h-6 w-6 mr-2" />
              <span className="text-lg font-semibold">Geri Dön</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Kullanıcı Profilleri</h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto mt-10">
        <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Profil Seç</h2>
              <button onClick={handleAddProfile} className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center">
                <Plus className="h-4 w-4 mr-1" /> Yeni Profil
              </button>
            </div>
            <div className="flex justify-center items-center space-x-4 flex-wrap">
              {profiles.map((profile, index) => (
                <div
                  key={profile.id}
                  className={`relative cursor-pointer group mb-4`}
                  onClick={() => setSelectedProfile(profile)}
                >
                  <div 
                    className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl 
                    ${selectedProfile.id === profile.id ? 'ring-4 ring-blue-500' : 'ring-2 ring-gray-300'}
                    ${index % 2 === 0 ? 'bg-blue-100' : 'bg-green-100'} transition-all duration-200`}
                  >
                    {profile.avatar}
                  </div>
                  <p className="mt-2 text-center font-semibold">{profile.name}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveProfile(profile.id);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {selectedProfile && (
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-blue-100 rounded-full p-3 w-32 h-32 flex items-center justify-center text-6xl">
                  {selectedProfile.avatar}
                </div>
              </div>
              
              <div className="space-y-4">
                {renderField('name', 'İsim', <User className="h-5 w-5 text-blue-600" />)}
                {renderField('age', 'Yaş', <Calendar className="h-5 w-5 text-blue-600" />)}
                {renderField('level', 'Seviye', <Star className="h-5 w-5 text-blue-600" />)}
                {renderField('hobbies', 'Hobiler', <Heart className="h-5 w-5 text-blue-600" />)}
                {renderField('interests', 'İlgi Alanları', <Music className="h-5 w-5 text-blue-600" />)}
                {renderField('favoriteColors', 'Favori Renkler', <Palette className="h-5 w-5 text-blue-600" />)}
                {renderField('favoriteFoods', 'Favori Yemekler', <Coffee className="h-5 w-5 text-blue-600" />)}
              </div>

              <div className="mt-6">
                <button
                  onClick={handleViewAnalysis}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
                >
                  Analiz Sonuçlarını Görüntüle
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;