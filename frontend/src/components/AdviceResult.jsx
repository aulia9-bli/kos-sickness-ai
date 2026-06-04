import React from 'react';

export const AdviceResult = ({ data, loading, error }) => {
  if (loading) {
    return null;
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded-2xl shadow-lg p-8">
        <div className="flex items-start gap-4">
          <span className="text-4xl">❌</span>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-red-800 mb-2">Terjadi Kesalahan</h3>
            <p className="text-red-700 text-lg">{error}</p>
            <p className="text-red-600 text-sm mt-3">💡 Pastikan backend sudah berjalan dan API key valid</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // Parse advice untuk formatting yang lebih baik
  const adviceLines = data.advice.split('\n').filter(line => line.trim());

  return (
    <div className="space-y-6">
      {/* Keluhan yang dianalisis */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
        <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-2">📌 Keluhan yang Dianalisis</h3>
        <p className="text-gray-700 text-lg italic">{data.complaint}</p>
      </div>

      {/* Main Advice */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          💊 Saran Kesehatan dari AI
        </h2>
        
        <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
          <div className="space-y-3 text-gray-700 leading-relaxed">
            {adviceLines.map((line, idx) => {
              // Highlight bullet points
              if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
                return (
                  <div key={idx} className="flex gap-3">
                    <span className="text-blue-600 font-bold flex-shrink-0 mt-1">▪</span>
                    <p className="text-gray-700">{line.replace(/^[-•]\s*/, '')}</p>
                  </div>
                );
              }
              
              // Highlight numbered points
              if (/^\d+\./.test(line.trim())) {
                return (
                  <div key={idx} className="flex gap-3 bg-white p-3 rounded-lg">
                    <span className="text-blue-600 font-bold flex-shrink-0">{line.match(/^\d+/)[0]}.</span>
                    <p className="text-gray-700">{line.replace(/^\d+\.\s*/, '')}</p>
                  </div>
                );
              }

              // Highlight headers (all caps or ending with :)
              if (line.toUpperCase() === line || line.endsWith(':')) {
                return (
                  <h3 key={idx} className="text-lg font-bold text-gray-900 mt-4 pt-2 border-t border-gray-300">
                    {line}
                  </h3>
                );
              }

              return (
                <p key={idx} className="text-gray-700">
                  {line}
                </p>
              );
            })}
          </div>
        </div>

        {/* Info Boxes */}
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <div className="bg-amber-50 rounded-xl p-4 border-l-4 border-amber-500">
            <p className="text-sm font-bold text-amber-900 mb-1">⏰ Kapan Ke Dokter?</p>
            <p className="text-sm text-amber-800">Jika gejala tidak membaik dalam 3 hari atau malah memburuk</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-500">
            <p className="text-sm font-bold text-green-900 mb-1">✅ Pencegahan</p>
            <p className="text-sm text-green-800">Istirahat cukup, minum air banyak, dan jaga kebersihan</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-red-50 rounded-2xl shadow-lg p-6 border-2 border-red-300 flex items-start gap-4">
        <span className="text-3xl flex-shrink-0">⚠️</span>
        <div>
          <h4 className="font-bold text-red-800 text-lg mb-2">Disclaimer Penting</h4>
          <p className="text-red-700 text-sm leading-relaxed">
            Saran ini hanya untuk <strong>pertolongan pertama</strong> dan bukan pengganti konsultasi medis profesional. 
            Jika gejala berlanjut, memburuk, atau Anda merasa serius, segera temui dokter atau kunjungi rumah sakit terdekat. 
            <strong> Gunakan layanan 112 untuk keadaan darurat medis.</strong>
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-xs text-gray-500 p-4">
        <p>⏱️ Dianalisis pada: <span className="font-mono">{new Date(data.timestamp).toLocaleString('id-ID')}</span></p>
        <p className="mt-1">🤖 Powered by Groq AI • llama-3.1-8b-instant</p>
      </div>
    </div>
  );
};

export default AdviceResult;
