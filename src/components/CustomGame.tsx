import React, {createContext, useContext, useEffect, useState} from 'react';
import type {Settings} from '../gameTick';
import { baseCityData } from '../gameTick';

export const CustomGame: React.FC<{settings: Settings, setAppState:(newState: string) => void, setSettings:(newSettings: Settings) => void}> = ({settings, setAppState, setSettings}) => {
    return (
        <div className="App">
          <main>
            <h1>Custom Game Settings</h1>
            <form onSubmit={(e) => {
              e.preventDefault();
              setAppState("game");
            }}>
              <label>
                Start City:
                <input type="text" value={settings.startCity} onChange={(e) => setSettings({...settings, startCity: e.target.value})} />
              </label>
              <br />
              <label>
                Starting Budget:
                <input type="number" value={settings.startBudget} onChange={(e) => setSettings({...settings, startBudget: parseInt(e.target.value)})} />
              </label>
              <br />
              <label>
                Time Limit (hours):
                <input type="number" value={settings.timeLimit / 60} onChange={(e) => setSettings({...settings, timeLimit: parseInt(e.target.value) * 60})} />
              </label>
              <br />
              <button type="submit">Start Custom Game</button>
            </form>
          </main>
        </div>
      );
  };
  
  export default CustomGame;