import React, {createContext, useContext, useEffect, useState} from 'react';
import './TicketShop.css';
import type {GameState} from '../gameTick';
import {durationDisplayString, clockDisplayString, shortClockDisplayString} from '../gameTick';

export const TicketShop: React.FC<{ gameState: GameState; updateGameState: (newState: Partial<GameState>) => void }> = ({ gameState, updateGameState}) => {

    const currentCityFlights = gameState.cities.find(city => city.name === gameState.selectedCity)?.flights || [];
    const filteredFlights = currentCityFlights.filter(
        flight => flight.startTime > gameState.time && flight.startTime <= gameState.time + 1440
    );

    const flightsByDestination = filteredFlights.reduce<Record<string, typeof filteredFlights>>((acc, flight) => {
        if (!acc[flight.endCity]) {
            acc[flight.endCity] = [];
        }
        acc[flight.endCity].push(flight);
        return acc;
    }, {});

    const buyTicket = (flightId: string) => {
        const flight = gameState.flightMap[flightId];
        if (!flight) return;

        if (gameState.balance >= flight.price) {
            updateGameState({
                balance: gameState.balance - flight.price,
                ticketedFlights: [...gameState.ticketedFlights, flightId],
            });
        } else {
            alert('Insufficient balance to buy this ticket.');
        }
    }

    const selectCity = (cityName: string) => {
        console.log(`Selecting city: ${cityName}`);
        updateGameState({ selectedCity: cityName });
    }

    const sortedDestinations = Object.keys(flightsByDestination).sort();

    const ticketElements = sortedDestinations.map((destination, index) => (
        <div key={index} className="destination-group">
            <div className="destination-info">
                <button className="destination-name" onClick={()=>selectCity(destination)}>{destination}</button>
                <div className="destination-cost">${flightsByDestination[destination][0].price}</div>
                <div className="destination-duration">{durationDisplayString(flightsByDestination[destination][0].duration)}</div>
            </div>
            <div className="flights">
                {flightsByDestination[destination].map(flight => (
                    <div key={flight.id} className="flight">
                        <button 
                            disabled={gameState.ticketedFlights.includes(flight.id)} 
                            onClick={buyTicket.bind(null, flight.id)}
                        >
                            {shortClockDisplayString(flight.startTime)}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    ));
    
    return (
      <div className="ticket-shop">
        <div className="ticket-shop-header">
          <h2>Flights From {gameState.selectedCity}</h2>
        </div>
        <div className="ticket-shop-content">
          <div className="tickets">
            {ticketElements.length > 0 ? ticketElements : <p>No flights available</p>}
          </div>
        </div>
      </div>
    );
  };
  
  export default TicketShop;