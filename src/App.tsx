import React, {createContext, useContext, useEffect, useState} from 'react';
import './App.css';
import GameComponent from './components/GameComponent';

function App(): JSX.Element {
  const [state, setState] = useState<string>("menu");
  if(state === "menu") {
    return (
      <div className="App">
        <main>
          <div className="mainmenu">
            <div>
              <h1>Around the World in 96 Hours</h1>
            </div>
            <div>
              <button onClick={() => setState("howtoplay")}>How to Play</button>
            </div>
            <div>
              <button onClick={() => setState("game")}>Start Game</button>
            </div>
          </div>
        </main>
      </div>
    );
  } else if(state === "game") {
    return (
      <div className="App">
        <main>
          <GameComponent />
        </main>
      </div>
    );
  } else if(state === "lose") {
    return (
      <div className="App">
        <main>
          <h1>Game Over</h1>
          <button onClick={() => setState("menu")}>Return to Menu</button>
        </main>
      </div>
    );
  } else if(state === "win") {
    return (
      <div className="App">
        <main>
          <h1>Congratulations! You Win!</h1>
          <button onClick={() => setState("menu")}>Return to Menu</button>
        </main>
      </div>
    );
  } else if (state === "howtoplay") {
    return (
      <div className="App">
        <main>
          <h1>How to Play</h1>
          <p>Your goal in this game is to circumnavigate the world and return to the city you started in.</p>
          <p>Click a city on the map to open its shop where you can buy flights.</p>
          <p>Click a time for a flight in the shop to buy it.</p>
          <p>When one of your booked flights departs, you will automatically take it.</p>
          <p>Time is always ticking. While you wait for your flight, you can look ahead to other cities, plan your route, and buy tickets in advance.</p>
          <button onClick={() => setState("menu")}>Return to Menu</button>
        </main>
      </div>
    );
  }
  else {
    return (
      <div className="App">
        <main>
          <h1>Unknown state: {state}</h1>
        </main>
      </div>
    );
  }
}

export default App;