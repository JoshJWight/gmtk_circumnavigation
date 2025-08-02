
import React, {createContext, useContext} from 'react';
import type {GameState} from './gameTick';

export const GameContext = createContext<GameState | undefined>(undefined);

export const useGameState = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGameState called in wrong place');
  return context;
};