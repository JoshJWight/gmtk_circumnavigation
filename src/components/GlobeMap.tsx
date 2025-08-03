import React, {createContext, useContext, useEffect, useState} from 'react';
import Globe from 'react-globe.gl';
import './GlobeMap.css';
import type {GameState, Flight} from '../gameTick';
import {baseCityData} from '../gameTick';
import {durationDisplayString, clockDisplayString} from '../gameTick';
import { distance, greatCircle, along, feature, lineString } from '@turf/turf';

type MarkerData = {
    lat: number;
    lng: number;
    color: string;
    cityName: string;
};

type ArcData = {
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
    color: string;
};

type LabelData = {
    lat: number;
    lng: number;
    label: string;
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
                <p>{flight.startCity} - {flight.endCity}</p>
                <p>{clockDisplayString(flight.startTime)} - {clockDisplayString(flight.startTime + flight.duration)}</p>
            </div>
        );
    })

    let statusLine1 = '';
    let statusLine2 = '';
    let statusLine3 = '';
    if(gameState.currentFlight) {
        const flight = gameState.flightMap[gameState.currentFlight];
        statusLine1 = `Flying to ${flight.endCity} from ${flight.startCity}`;
        statusLine2 = `Arrive at ${clockDisplayString(flight.startTime + flight.duration)} (${durationDisplayString(flight.startTime + flight.duration - gameState.time)})`;
    }
    else{
        statusLine1 = `In ${gameState.currentCity}`;
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
            statusLine2 = `Flight to ${nextFlight.endCity} departs ${clockDisplayString(nextFlight.startTime)} (${durationDisplayString(nextFlight.startTime - gameState.time)})`;
            statusLine3 = `Arrives ${clockDisplayString(nextFlight.startTime + nextFlight.duration)}`;
        } else {
            statusLine2 = `No flight booked yet`;
        }
    }

    const setSimSpeed = (speed: number) => {
        updateGameState({ simSpeed: speed });
    }

    const markerSvg = `<svg viewBox="-4 0 36 36">
        <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
        <circle fill="black" cx="14" cy="14" r="7"></circle>
    </svg>`;

    let gData: MarkerData[] = baseCityData.map(city => ({
        lat: city.latitude,
        lng: city.longitude,
        color: 'yellow',
        cityName: city.name
    }));

    let playerLocation: LabelData = {
        lat: gameState.currentCity ? baseCityData.find(city => city.name === gameState.currentCity)?.latitude || 0 : 0,
        lng: gameState.currentCity ? baseCityData.find(city => city.name === gameState.currentCity)?.longitude || 0 : 0,
        label: ""
    }

    if(gameState.currentFlight) {
        const flight = gameState.flightMap[gameState.currentFlight];
        const fractionAlong = (gameState.time - flight.startTime) / flight.duration;
        const startCity = baseCityData.find(city => city.name === flight.startCity);
        const endCity = baseCityData.find(city => city.name === flight.endCity);
        
        if (startCity && endCity) {
            const startPoint = [startCity.longitude, startCity.latitude];
            const endPoint = [endCity.longitude, endCity.latitude];
            const distkm = distance(startPoint, endPoint, { units: 'kilometers' });
            const line = greatCircle(startPoint, endPoint, { npoints: 100 });
            // Handle potential MultiLineString by taking the first LineString
            const geometry = line.geometry.type === 'LineString' ? line.geometry : line.geometry.coordinates[0];
            const lineStringGeometry = line.geometry.type === 'LineString' ? line.geometry : lineString(line.geometry.coordinates[0]).geometry;
            const pointAlong = along(lineStringGeometry, distkm * fractionAlong);
            playerLocation.lat = pointAlong.geometry.coordinates[1];
            playerLocation.lng = pointAlong.geometry.coordinates[0];
        }
    }

    gData.push({
        lat: playerLocation.lat,
        lng: playerLocation.lng,
        color: 'red',
        cityName: 'player'
    });

    let arcsData:ArcData[] = [];
    for(let i = 0; i < baseCityData.length; i++) {
        const city = baseCityData[i];
        for(let j=0; j<city.connections.length; j++) {
            const connection = city.connections[j];
            if(connection.destination < city.name) continue; // Avoid duplicate arcs
            const destinationCity = baseCityData.find(city => city.name === connection.destination);
            if (!destinationCity) continue;
            arcsData.push({
                startLat: city.latitude,
                startLng: city.longitude,
                endLat: destinationCity.latitude,
                endLng: destinationCity.longitude,
                color: "yellow"
            });
        }
    }

    

    const labelsData: LabelData[] = [playerLocation];
        
    return (
      <div className="globe-map">
        <div className="globe-overlay-top-left">
          <div className="sim-controls">
            <button onClick={() => setSimSpeed(1)} className={gameState.simSpeed === 1 ? 'active' : ''}>1x Speed</button>
            <button onClick={() => setSimSpeed(5)} className={gameState.simSpeed === 5 ? 'active' : ''}>5x Speed</button>
          </div>
          <div className="game-time">{clockDisplayString(gameState.time)}</div>
          <div className="game-deadline">Circumnavigate back to {gameState.startCity} by {clockDisplayString(gameState.deadline)}</div>
          <div className="game-status">
            <p>{statusLine1}</p>
            <p>{statusLine2}</p>
            <p>{statusLine3}</p>
          </div>
        </div>
        
        <div className="globe-overlay-top-right">
          <div className="current-tickets">
                <h4>Balance: ${gameState.balance}</h4>
                <h4>Tickets Booked:</h4>
                {currentTickets}
          </div>
        </div>
        
        <div className="map-container">
            <Globe
            width={window.innerWidth * 0.8}
            height={window.innerHeight}
            globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-dark.jpg"
            htmlElementsData={gData}
            htmlElement={(d: object) => {
                const markerData = d as MarkerData;
                const el = document.createElement('div');
                if(markerData.cityName === 'player') {
                    el.innerHTML = markerSvg;
                    el.style.color = markerData.color;
                    el.style.width = `50px`;
                    el.style.transition = 'opacity 250ms';
                    el.style.cursor = 'pointer';
                }
                else{
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
                }
                return el;
            }}
            htmlElementVisibilityModifier={(el, isVisible) => el.style.opacity = isVisible ? '1' : '0'}
            arcsData={arcsData}
            arcAltitude={0.12}
            //Labels cause runtime errors for some reason
            //labelsData={labelsData}
            //labelLat={playerLocation.latitude}
            //labelLng={playerLocation.longitude}
            //labelDotRadius={50}
            //labelColor={"red"}
            />
        </div>
      </div>
    );
};
  
  export default GlobeMap;