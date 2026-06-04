import React from 'react';

export const StatCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition duration-200 border border-gray-100">
      <div className="flex items-start gap-3">
        <span className="text-3xl flex-shrink-0">{icon}</span>
        <div>
          <h4 className="font-semibold text-gray-800">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
