import React from 'react';
import { Game } from './components/Game';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
      <Game />
    </div>
  );
};

export default App;
