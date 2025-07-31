import React, {createContext, useContext, useEffect, useState} from 'react';
import './GameComponent.css';
import TicketShop from './TicketShop';
import GlobeMap from './GlobeMap';

type Flight = {
  id: string;
  startCity: string;
  endCity: string;
  price: number;
  duration: number;
  startTime: number;
}

type City = {
  name: string;
  latitude: number;
  longitude: number;
  flights: Flight[];
}

type GameState = {
  time: number;
  balance: number;

  currentCity: string | null;
  currentFlight: string | null;

  cities: City[];
  flightMap: Record<string, Flight>;

  selectedCity: string | null;

  // other state fields
};

const GameContext = createContext<GameState | undefined>(undefined);

export const useGameState = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGameState called in wrong place');
  return context;
};

export const GameComponent: React.FC<React.PropsWithChildren> = ({  }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
      // update other global game states here
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <GameContext.Provider value={{ time }}>
      <GlobeMap />
      <TicketShop />
    </GameContext.Provider>
  );
};

export default GameComponent;