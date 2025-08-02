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

  useEffect(() => {
    const interval = setInterval(() => {
      setState(gameTick);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <GlobeMap gameState={state} time={state.time}/>
      <TicketShop gameState={state} time={state.time}/>
    </div>
  );
};

export default GameComponent;