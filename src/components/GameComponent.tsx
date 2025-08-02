import React, {createContext, useContext, useEffect, useState} from 'react';
import './GameComponent.css';
import TicketShop from './TicketShop';
import GlobeMap from './GlobeMap';
import type {GameState} from '../gameTick';
import gameTick from '../gameTick';
import { initializeGameState } from '../gameTick';
import {GameContext} from '../gameContext';


export const GameComponent: React.FC<React.PropsWithChildren> = ({  }) => {
  const [state, setState] = useState<GameState>(initializeGameState("London"));

  // Callback to update the GameState
  const updateGameState = (newState: Partial<GameState>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setState(prevState => gameTick(prevState));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="game-container">
      <GlobeMap gameState={state} updateGameState={updateGameState}/>
      <TicketShop gameState={state} updateGameState={updateGameState}/>
    </div>
  );
};

export default GameComponent;