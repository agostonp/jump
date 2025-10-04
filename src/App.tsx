import React from 'react';
import { Game } from './components/Game';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-[600px]">
        <Game />
      </div>
    </div>
  );
};

export default App;
