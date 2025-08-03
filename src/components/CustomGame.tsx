import React, {createContext, useContext, useEffect, useState} from 'react';
import './CustomGame.css';
import type {Settings} from '../gameTick';
import { baseCityData } from '../gameTick';

export const CustomGame: React.FC<{settings: Settings, setAppState:(newState: string) => void, setSettings:(newSettings: Settings) => void}> = ({settings, setAppState, setSettings}) => {
    return (
        <div className="custom-game">
          <h1>Custom Game Settings</h1>
          <p className="form-description">
            Customize your circumnavigation challenge with your preferred starting city, budget, and time limit.
          </p>
          <form className="custom-game-form" onSubmit={(e) => {
            e.preventDefault();
            setAppState("game");
          }}>
            <div className="form-group">
              <label>Start City:</label>
              <select value={settings.startCity} onChange={(e) => setSettings({...settings, startCity: e.target.value})}>
                {baseCityData.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Starting Budget ($):</label>
              <input 
                type="number" 
                value={settings.startBudget} 
                onChange={(e) => setSettings({...settings, startBudget: parseInt(e.target.value)})} 
                min="1000"
                max="50000"
                step="500"
              />
            </div>
            
            <div className="form-group">
              <label>Time Limit (hours):</label>
              <input 
                type="number" 
                value={settings.timeLimit / 60} 
                onChange={(e) => setSettings({...settings, timeLimit: parseInt(e.target.value) * 60})} 
                min="24"
                max="168"
                step="12"
              />
            </div>
            
            <div className="custom-game-buttons">
              <button type="submit">Start Custom Game</button>
              <button type="button" className="secondary" onClick={() => setAppState("menu")}>Back to Menu</button>
            </div>
          </form>
        </div>
      );
  };
  
  export default CustomGame;