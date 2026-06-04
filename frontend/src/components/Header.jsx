import React from 'react';

export const Header = () => {
  return (
    <header className="bg-gradient-to-br from-emerald-600 via-blue-600 to-indigo-700 text-white shadow-2xl">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold mb-2 flex items-center gap-3">
              <span className="text-5xl">⚕️</span> Kos-Sickness
            </h1>
            <p className="text-blue-100 text-lg">Konsultasi Kesehatan AI untuk Mahasiswa Kos</p>
            <p className="text-blue-200 text-sm mt-1">Powered by Groq AI • llama-3.1-8b-instant</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
