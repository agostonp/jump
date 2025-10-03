import React from 'react';

interface LifeLostModalProps {
  livesRemaining: number;
  onContinue: () => void;
}

export const LifeLostModal: React.FC<LifeLostModalProps> = ({ livesRemaining, onContinue }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-gray-800 text-white p-8 rounded-lg text-center border-4 border-red-500">
        <h2 className="text-3xl font-bold mb-4 text-red-500">Life Lost!</h2>
        <p className="text-xl mb-6">
          Lives Remaining:
          <span className="ml-2 text-2xl font-bold">
            {Array.from({ length: livesRemaining }).map((_, i) => (
              <span key={i} className="text-red-500">❤ </span>
            ))}
          </span>
        </p>
        <button
          onClick={onContinue}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
