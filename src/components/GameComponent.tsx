import React, {createContext, useContext, useEffect, useState} from 'react';
import './GameComponent.css';
import TicketShop from './TicketShop';
import GlobeMap from './GlobeMap';
import type {GameState} from '../gameTick';
import gameTick from '../gameTick';


let initialState: GameState = {
  time: 0,
  balance: 1000,
  currentCity: "London",
  currentFlight: null,
  ticketedFlights: [],
  cities: [],
  flightMap: {},
  selectedCity: null,
};

const GameContext = createContext<GameState | undefined>(undefined);

export const useGameState = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGameState called in wrong place');
  return context;
};

export const GameComponent: React.FC<React.PropsWithChildren> = ({  }) => {
  const [state, setState] = useState<GameState>(initialState);

  useEffect(() => {
    const interval = setInterval(() => {
      setState(gameTick);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <GameContext.Provider value={state}>
      <GlobeMap />
      <TicketShop />
    </GameContext.Provider>
  );
};

export default GameComponent;