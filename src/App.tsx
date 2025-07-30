import React from 'react';
import './App.css';
import GameComponent from './components/GameComponent';

function App(): JSX.Element {
  return (
    <div className="App">
      <header className="App-header">
        <h1>GMTK Circumnavigation</h1>
        <p>Around the world in 96 hours</p>
      </header>
      <main>
        <GameComponent />
      </main>
    </div>
  );
}

export default App;