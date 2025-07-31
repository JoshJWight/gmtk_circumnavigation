import React, {createContext, useContext, useEffect, useState} from 'react';
import './GameComponent.css';

type GameState = {
  time: number;
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
      <p>{time}</p>
    </GameContext.Provider>
  );
};

export default GameComponent;