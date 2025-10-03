import React from 'react';

export const Bird: React.FC = () => {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ pointerEvents: 'none', zIndex: 10 }}
    >
      <div className="relative">
        {/* Bird body */}
        <div className="w-8 h-8 bg-orange-500 rounded-full border-2 border-orange-700" />
        {/* Bird eye */}
        <div className="absolute top-1 right-2 w-1.5 h-1.5 bg-white rounded-full" />
        <div className="absolute top-1.5 right-2 w-1 h-1 bg-black rounded-full" />
      </div>
    </div>
  );
};
