import React, {createContext, useContext, useEffect, useState} from 'react';
import './GameComponent.css';
import TicketShop from './TicketShop';
import GlobeMap from './GlobeMap';
import type {GameState, Settings} from '../gameTick';
import gameTick from '../gameTick';
import { initializeGameState, durationDisplayString } from '../gameTick';


export const GameComponent: React.FC<{settings: Settings, setAppState:(newState: string) => void, setResultMessage:(newMessage: string) => void}> = ({settings, setAppState, setResultMessage}) => {
  const [state, setState] = useState<GameState>(initializeGameState(settings));

  // Callback to update the GameState
  const updateGameState = (newState: Partial<GameState>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setState(prevState => gameTick(prevState, setAppState, setResultMessage));
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