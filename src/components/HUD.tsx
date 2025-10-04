import React from 'react';

interface HUDProps {
  score: number;
  lives: number;
}

export const HUD: React.FC<HUDProps> = ({ score, lives }) => {
  return (
    <div className="flex justify-between text-white text-xl font-bold">
      <div className="bg-black bg-opacity-50 px-4 py-2 rounded">
        Score: {score}
      </div>
      <div className="bg-black bg-opacity-50 px-4 py-2 rounded flex items-center gap-2">
        Lives:
        {Array.from({ length: lives }).map((_, i) => (
          <span key={i} className="text-red-500">
            ❤
          </span>
        ))}
      </div>
    </div>
  );
};
