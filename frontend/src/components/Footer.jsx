import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-8 mt-12 border-t border-gray-700">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 mb-6">
          {/* Left Section - Project Info */}
          <div>
            <h4 className="text-white font-bold mb-2 flex items-center gap-2">
              <span className="text-2xl">⚕️</span> Kos-Sickness
            </h4>
            <p className="text-gray-400 text-sm">
              Aplikasi konsultasi kesehatan AI untuk mahasiswa kos. Memberikan saran pertolongan pertama yang spesifik dan relevan dengan kondisi kehidupan di kos-kosan.
            </p>
          </div>

          {/* Right Section - Credits */}
          <div className="md:text-right">
            <p className="text-sm text-gray-300 font-semibold mb-2">
              Dibuat oleh: <span className="text-blue-400">Shabrina Aulia & Uswatun Aulia</span>
            </p>
            <p className="text-sm text-gray-400">
              <span className="text-emerald-400 font-semibold">Universitas Stikubank Semarang</span>
            </p>
            <p className="text-xs text-gray-500 mt-2">Tugas Akhir Semester (UTS) - AI Project</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
            <div>
              <p>© 2024 Kos-Sickness • All rights reserved</p>
            </div>
            <div className="mt-3 md:mt-0">
              <p>Powered by <span className="text-blue-400">Groq AI</span> • llama-3.1-8b-instant</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
