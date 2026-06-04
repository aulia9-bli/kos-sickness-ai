import React from 'react';

export const SicknessForm = ({ onSubmit, loading }) => {
  const [complaint, setComplaint] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!complaint.trim()) {
      setError('Silakan masukkan keluhan Anda');
      return;
    }

    if (complaint.length < 5) {
      setError('Keluhan minimal 5 karakter');
      return;
    }

    onSubmit(complaint);
  };

  const examplePlacements = [
    'Sakit kepala, pusing, dan demam tinggi',
    'Batuk, pilek, dan sulit tidur',
    'Perut kembung dan mual',
    'Mata merah dan gatal-gatal'
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">📝 Laporan Gejala Kesehatan</h2>
        <p className="text-gray-600">Jelaskan gejala atau keluhan kesehatan yang Anda alami dengan detail. AI kami akan menganalisis dan memberikan saran pertolongan pertama yang spesifik.</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi Keluhan</label>
          <textarea
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            placeholder="Contoh: Saya mengalami sakit kepala, pusing, dan demam tinggi sejak kemarin pagi..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition duration-200"
            rows="5"
            disabled={loading}
          />
          <div className="flex justify-between mt-2">
            <p className="text-sm text-gray-600">
              <span className={complaint.length > 1900 ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                {complaint.length}/2000
              </span>
              {' '}karakter
            </p>
            <div className="text-xs text-gray-500">
              ✓ Min 5 karakter
            </div>
          </div>
        </div>

        {/* Quick Examples */}
        <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-xs font-semibold text-blue-900 mb-2">💡 Contoh Keluhan:</p>
          <div className="flex flex-wrap gap-2">
            {examplePlacements.map((example, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setComplaint(example)}
                className="text-xs px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition duration-150"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !complaint.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-4 rounded-xl transition duration-300 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Menganalisis dengan AI...
            </>
          ) : (
            <>
              🚀 Dapatkan Saran Kesehatan
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SicknessForm;
