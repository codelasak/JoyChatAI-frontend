import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { ArrowLeft } from 'lucide-react';

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

// Mock data for charts
const timeEmotionData = [
  { time: '08:00', happiness: 7, excitement: 5, calmness: 8 },
  { time: '10:00', happiness: 8, excitement: 6, calmness: 7 },
  { time: '12:00', happiness: 6, excitement: 8, calmness: 5 },
  { time: '14:00', happiness: 9, excitement: 7, calmness: 6 },
  { time: '16:00', happiness: 7, excitement: 9, calmness: 4 },
];

const emotionPieData = [
  { name: 'Mutlu', value: 40 },
  { name: 'Heyecanlı', value: 30 },
  { name: 'Sakin', value: 20 },
  { name: 'Üzgün', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const mostUsedWords = [
  { word: 'oyun', count: 15 },
  { word: 'arkadaş', count: 12 },
  { word: 'okul', count: 10 },
  { word: 'öğretmen', count: 8 },
  { word: 'kitap', count: 7 },
];

const radarData = [
  { subject: 'Etkileşim Başlatma', A: 120, B: 110, fullMark: 150 },
  { subject: 'Dikkat Süresi', A: 98, B: 130, fullMark: 150 },
  { subject: 'Etkileşim Sürdürme', A: 86, B: 130, fullMark: 150 },
  { subject: 'Sözlü iletişim', A: 99, B: 100, fullMark: 150 },
  { subject: 'Göz Teması', A: 85, B: 90, fullMark: 150 },
  { subject: 'Ortak Dikkat', A: 65, B: 85, fullMark: 150 },
];

const AnalysisResults: React.FC = () => {
  const location = useLocation();
  const selectedProfile = location.state?.selectedProfile as ProfileInfo;

  if (!selectedProfile) {
    return <div>No profile selected. Please go back and select a profile.</div>;
  }

  const totalWords = 500; // Mock total words used
  const uniqueWords = 150; // Mock unique words count

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link to="/profile" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Geri Dön</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Analiz Sonuçları: {selectedProfile.name}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Profil Bilgileri</h2>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Avatar</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{selectedProfile.avatar}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Yaş</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{selectedProfile.age}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Seviye</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{selectedProfile.level}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Hobiler</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{selectedProfile.hobbies.join(', ')}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">İlgi Alanları</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{selectedProfile.interests.join(', ')}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Duygu Dağılımı</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={emotionPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {emotionPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Zaman/Duygu Grafiği</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeEmotionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="happiness" stroke="#8884d8" />
                <Line type="monotone" dataKey="excitement" stroke="#82ca9d" />
                <Line type="monotone" dataKey="calmness" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">En Çok Kullanılan Kelimeler</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mostUsedWords}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="word" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">İletişim Becerileri </h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} />
                  <Radar name="Öğrenci" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name="Ortalama" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Kelime İstatistikleri</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Toplam Kullanılan Kelime Sayısı</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{totalWords}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Benzersiz Kelime Sayısı</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{uniqueWords}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;