import React from 'react';
import './App.css';
import GameComponent from './components/GameComponent';

function App(): JSX.Element {
  return (
    <div className="App">
      <main>
        <GameComponent />
      </main>
    </div>
  );
}

export default App;