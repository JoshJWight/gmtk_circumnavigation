import React, {createContext, useContext, useEffect, useState} from 'react';
import Globe from 'react-globe.gl';
import './GlobeMap.css';
import type {GameState, Flight} from '../gameTick';
import {durationDisplayString, clockDisplayString} from '../gameTick';
import { useGameState, GameContext } from '../gameContext';

type MarkerData = {
    lat: number;
    lng: number;
    size: number;
    color: string;
    cityName: string;
};

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

    const markerSvg = `<svg viewBox="-4 0 36 36">
        <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
        <circle fill="black" cx="14" cy="14" r="7"></circle>
    </svg>`;

    const gData: MarkerData[] = gameState.cities.map(city => ({
        lat: city.latitude,
        lng: city.longitude,
        size: 30,
        color: 'yellow',
        cityName: city.name
    }));

        
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
            <Globe
            globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-dark.jpg"
            htmlElementsData={gData}
            htmlElement={(d: object) => {
                const markerData = d as MarkerData;
                const el = document.createElement('div');
                el.innerHTML = markerSvg;
                el.style.color = markerData.color;
                el.style.width = `${markerData.size}px`;
                el.style.transition = 'opacity 250ms';

                el.style.setProperty('pointer-events', 'auto');
                el.style.cursor = 'pointer';
                el.onclick = () => console.info(markerData);
                return el;
            }}
            htmlElementVisibilityModifier={(el, isVisible) => el.style.opacity = isVisible ? '1' : '0'}
            />
        </div>
      </div>
    );
};
  
  export default GlobeMap;