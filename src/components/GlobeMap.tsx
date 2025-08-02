import React, {createContext, useContext, useEffect, useState} from 'react';
import Globe from 'react-globe.gl';
import './GlobeMap.css';
import type {GameState, Flight} from '../gameTick';
import {baseCityData} from '../gameTick';
import {durationDisplayString, clockDisplayString} from '../gameTick';

type MarkerData = {
    lat: number;
    lng: number;
    color: string;
    cityName: string;
};

export const GlobeMap: React.FC<{ gameState: GameState; updateGameState: (newState: Partial<GameState>) => void }> = ({ gameState, updateGameState}) => {

    const selectCity = (cityName: string) => {
        console.log(`Selecting city: ${cityName}`);
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

    const gData: MarkerData[] = baseCityData.map(city => ({
        lat: city.latitude,
        lng: city.longitude,
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
            <Globe
            width={1920 * 0.7}
            height={1000}
            globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-dark.jpg"
            htmlElementsData={gData}
            htmlElement={(d: object) => {
                const markerData = d as MarkerData;
                const el = document.createElement('div');
                el.innerHTML = `<div class="city-marker">${markerData.cityName}</div>`;
                el.style.color = markerData.color;
                el.style.width = `80px`;
                el.style.height = `50px`;
                el.style.transition = 'opacity 250ms';
                el.style.display = 'flex';
                el.style.alignItems = 'center';
                el.style.justifyContent = 'center';
                el.style.textAlign = 'center';
                el.style.fontSize = '12px';
                el.style.fontWeight = 'bold';
                el.style.textShadow = '1px 1px 2px rgba(0,0,0,0.8)';
                el.style.padding = '4px';
                el.style.borderRadius = '4px';
                el.style.backgroundColor = 'rgba(0,0,0,0.3)';
                el.style.border = '1px solid rgba(255,255,255,0.3)';

                el.style.setProperty('pointer-events', 'auto');
                el.style.cursor = 'pointer';
                
                // Stable hover effects without transform
                el.addEventListener('mouseenter', () => {
                    el.style.backgroundColor = 'rgba(255,255,0,0.6)';
                    el.style.borderColor = 'rgba(255,255,0,0.8)';
                });
                
                el.addEventListener('mouseleave', () => {
                    el.style.backgroundColor = 'rgba(0,0,0,0.3)';
                    el.style.borderColor = 'rgba(255,255,255,0.3)';
                });
                
                el.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    selectCity(markerData.cityName);
                };
                return el;
            }}
            htmlElementVisibilityModifier={(el, isVisible) => el.style.opacity = isVisible ? '1' : '0'}
            />
        </div>
      </div>
    );
};
  
  export default GlobeMap;