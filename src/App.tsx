import React, {createContext, useContext, useEffect, useState} from 'react';
import './App.css';
import GameComponent from './components/GameComponent';
import CustomGame from './components/CustomGame';
import type {Settings} from './gameTick';

function App(): JSX.Element {
  const [state, setState] = useState<string>("menu");
  const [resultMessage, setResultMessage] = useState<string>("");
  const [settings, setSettings] = useState<Settings>({
    startCity: "London",
    startBudget: 5000,
    timeLimit: 24 * 60 * 4
  });

  if(state === "menu") {
    return (
      <div className="App">
        <main>
          <div className="mainmenu">
            <h1>Around the World in 96 Hours</h1>
            <button onClick={() => setState("howtoplay")}>How to Play</button>
            <button onClick={() => setState("game")}>Start Game</button>
            <button onClick={() => setState("customgame")}>Custom Game</button>
          </div>
        </main>
      </div>
    );
  } else if(state === "game") {
    return (
      <div className="App">
        <main>
          <GameComponent settings={settings} setAppState={setState} setResultMessage={setResultMessage}/>
        </main>
      </div>
    );
  } else if(state === "lose") {
    return (
      <div className="App">
        <main>
          <div className="menu-page">
            <h1>Game Over</h1>
            <p>{resultMessage}</p>
            <button onClick={() => setState("menu")}>Return to Menu</button>
          </div>
        </main>
      </div>
    );
  } else if(state === "win") {
    return (
      <div className="App">
        <main>
          <div className="menu-page">
            <h1>Successful Circumnavigation!</h1>
            <p>{resultMessage}</p>
            <button onClick={() => setState("menu")}>Return to Menu</button>
          </div>
        </main>
      </div>
    );
  } else if (state === "howtoplay") {
    return (
      <div className="App">
        <main>
          <div className="menu-page">
            <h1>How to Play</h1>
            <div className="instructions">
              <p>Your goal in this game is to circumnavigate the world and return to the city you started in.</p>
              <p>Both westwards and eastwards circumnavigations are valid.</p>
              <p>Double-click a city on the map to open its shop where you can book tickets for flights.</p>
              <p>Click a time for a flight in the shop to book it.</p>
              <p>The shop only shows flights for the next 24 hours.</p>
              <p>When one of your booked flights departs, you will automatically take it if you are in the right city.</p>
              <p>Time is always ticking. While you wait for your flight, you can look ahead to other cities, plan your route, and buy tickets in advance.</p>
              <p>If your route is set for the next while, you can speed up time with the 5x Speed button in the top left.</p>
            </div>
            <button onClick={() => setState("menu")}>Return to Menu</button>
          </div>
        </main>
      </div>
    );
  } else if (state === "customgame") {
    return (
      <div className="App">
        <main>
          <CustomGame settings={settings} setAppState={setState} setSettings={setSettings}/>
        </main>
      </div>
    );
  }
  else {
    return (
      <div className="App">
        <main>
          <div className="menu-page">
            <h1>Unknown state: {state}</h1>
          </div>
        </main>
      </div>
    );
  }
}

export default App;