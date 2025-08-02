import React, {createContext, useContext, useEffect, useState} from 'react';
import './GlobeMap.css';
import type {GameState, Flight} from '../gameTick';
import {durationDisplayString, clockDisplayString} from '../gameTick';
import { useGameState, GameContext } from '../gameContext';

export const GlobeMap: React.FC<{ gameState: GameState, time:number }> = ({ gameState, time }) => {
    useEffect(() => {
        console.log('Map component updated');
    }, [time]);

    const cityButtons = gameState.cities.map((city, index) => (
        <button 
            key={index} 
            className={`city-button ${gameState.selectedCity === city.name ? 'selected' : ''}`}
            onClick={() => {
                //TODO
            }}
        >
            {city.name}
        </button>
    ));

    let status = '';
    if(gameState.currentFlight) {
        const flight = gameState.flightMap[gameState.currentFlight];
        status = `Flying to ${flight.endCity} (${durationDisplayString(flight.startTime + flight.duration - gameState.time)} left)`;
    }
    else{
        let nextFlight: Flight | null = null;
        for(const flightId of gameState.ticketedFlights) {
            const flight = gameState.flightMap[flightId];
            if(flight.startCity === gameState.currentCity) {
                if(!nextFlight || flight.startTime < nextFlight.startTime) {
                    nextFlight = flight;
                }
            }
        }
        if(nextFlight) {
            status = `Waiting for flight to ${nextFlight.endCity} at ${clockDisplayString(nextFlight.startTime)} (${durationDisplayString(nextFlight.startTime - gameState.time)} left)`;
        } else {
            status = `Waiting at ${gameState.currentCity}`;
        }
    }
    
    return (
      <div className="globe-map">
        <p>Map</p>
        <p>{clockDisplayString(time)}</p>
        <p>{status}</p>
        <div className="map-container">
            {cityButtons}
        </div>
      </div>
    );
};
  
  export default GlobeMap;