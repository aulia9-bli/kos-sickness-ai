import React from 'react';
import Header from './components/Header.jsx';
import SicknessForm from './components/SicknessForm.jsx';
import AdviceResult from './components/AdviceResult.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import Footer from './components/Footer.jsx';
import { analyzeSickness } from './services/apiClient.js';

function App() {
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [history, setHistory] = React.useState([]);

  const handleFormSubmit = async (complaint) => {
    setLoading(true);
    setError('');

    try {
      const response = await analyzeSickness(complaint);
      if (response.success) {
        setResult(response.data);
        // Add to history
        setHistory(prev => [{
          complaint,
          advice: response.data.advice,
          timestamp: new Date()
        }, ...prev].slice(0, 5)); // Keep last 5
      } else {
        setError(response.message || 'Terjadi kesalahan saat menganalisis');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(
        err.message === 'Network Error'
          ? 'Tidak dapat terhubung ke server. Pastikan backend berjalan di http://localhost:5000'
          : err.message || 'Terjadi kesalahan saat menganalisis'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <SicknessForm onSubmit={handleFormSubmit} loading={loading} />
            {loading && <LoadingSpinner />}
            <AdviceResult data={result} loading={loading} error={error} />
          </div>

          {/* Sidebar - Features & Tips */}
          <div className="space-y-6">
            {/* Features Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">✨ Fitur Aplikasi</h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-2xl flex-shrink-0">🤖</span>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">AI Analysis</p>
                    <p className="text-xs text-gray-600">Analisis cepat dengan Groq AI</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-2xl flex-shrink-0">⚡</span>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">Instant Response</p>
                    <p className="text-xs text-gray-600">Hasil dalam hitungan detik</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-2xl flex-shrink-0">🎯</span>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">Spesifik Mahasiswa</p>
                    <p className="text-xs text-gray-600">Saran sesuai kondisi kos</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-2xl flex-shrink-0">🔒</span>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">Privat & Aman</p>
                    <p className="text-xs text-gray-600">Data tidak disimpan</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border border-green-200">
              <h3 className="text-lg font-bold text-green-900 mb-3">💡 Tips Kesehatan</h3>
              <ul className="space-y-2 text-sm text-green-800">
                <li>✓ Minum air putih 8 gelas sehari</li>
                <li>✓ Istirahat minimal 7-8 jam</li>
                <li>✓ Konsumsi buah & sayuran</li>
                <li>✓ Olahraga teratur 30 min</li>
                <li>✓ Jaga kebersihan lingkungan</li>
              </ul>
            </div>

            {/* Emergency Card */}
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl shadow-lg p-6 border border-red-200">
              <h3 className="text-lg font-bold text-red-900 mb-3">🚨 Darurat Medis</h3>
              <p className="text-sm text-red-800 mb-3">Segera ke rumah sakit jika:</p>
              <ul className="space-y-1 text-xs text-red-700">
                <li>• Demam {">"}39°C atau dingin ekstrem</li>
                <li>• Kesulitan bernapas</li>
                <li>• Nyeri dada atau perut berat</li>
                <li>• Muntah/diare berkelanjutan</li>
              </ul>
              <p className="text-sm font-bold text-red-900 mt-3">☎️ Hubungi 112</p>
            </div>

            {/* History Card */}
            {history.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-3">📜 Riwayat Konsultasi</h3>
                <div className="space-y-2">
                  {history.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setResult({ 
                        complaint: item.complaint, 
                        advice: item.advice,
                        timestamp: item.timestamp.toISOString()
                      })}
                      className="w-full text-left p-2 bg-gray-50 hover:bg-blue-50 rounded-lg transition duration-200 border border-gray-200"
                    >
                      <p className="text-xs font-semibold text-gray-700 truncate">{item.complaint}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.timestamp.toLocaleTimeString('id-ID')}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
