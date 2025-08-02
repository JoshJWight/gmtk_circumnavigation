import React, {createContext, useContext, useEffect, useState} from 'react';
import './GlobeMap.css';
import type {GameState, Flight} from '../gameTick';
import {durationDisplayString, clockDisplayString} from '../gameTick';
import { useGameState, GameContext } from '../gameContext';

export const GlobeMap: React.FC<{ gameState: GameState; updateGameState: (newState: Partial<GameState>) => void }> = ({ gameState, updateGameState}) => {

    const selectCity = (cityName: string) => {
        updateGameState({ selectedCity: cityName });
    }

    const currentTickets = gameState.ticketedFlights.map((flightId) => {
        const flight = gameState.flightMap[flightId];
        return (
            <div key={flightId} className="ticket">
                <p>{flight.startCity} to {flight.endCity} {clockDisplayString(flight.startTime)} - {clockDisplayString(flight.startTime + flight.duration)}</p>
            </div>
        );
    })

    const cityButtons = gameState.cities.map((city, index) => (
        <button 
            key={index} 
            className={`city-button ${gameState.selectedCity === city.name ? 'selected' : ''}`}
            onClick={() => {
                selectCity(city.name);
            }}
        >
            {city.name}
        </button>
    ));

    let status = '';
    if(gameState.currentFlight) {
        const flight = gameState.flightMap[gameState.currentFlight];
        status = `Flying to ${flight.endCity} (${durationDisplayString(flight.startTime + flight.duration - gameState.time)} left, arrive at ${clockDisplayString(flight.startTime + flight.duration)})`;
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
            status = `In ${gameState.currentCity}, waiting for flight to ${nextFlight.endCity} at ${clockDisplayString(nextFlight.startTime)} (${durationDisplayString(nextFlight.startTime - gameState.time)} until departure, arrives at ${clockDisplayString(nextFlight.startTime + nextFlight.duration)})`;
        } else {
            status = `Waiting in ${gameState.currentCity} with no flight booked yet`;
        }
    }

    const setSimSpeed = (speed: number) => {
        updateGameState({ simSpeed: speed });
    }
    
    return (
      <div className="globe-map">
        <button onClick={() => setSimSpeed(1)}>1x Speed</button>
        <button onClick={() => setSimSpeed(5)}>5x Speed</button>
        <p>Map</p>
        <p>{clockDisplayString(gameState.time)}</p>
        <p>{status}</p>
        {currentTickets}
        <div className="map-container">
            {cityButtons}
        </div>
      </div>
    );
};
  
  export default GlobeMap;