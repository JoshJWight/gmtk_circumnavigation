import React, {createContext, useContext, useEffect, useState} from 'react';
import './TicketShop.css';
import type {GameState} from '../gameTick';
import {durationDisplayString, clockDisplayString, shortClockDisplayString} from '../gameTick';
import { useGameState } from '../gameContext';

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

    const ticketElements = Object.keys(flightsByDestination).map((destination, index) => (
        <div key={index} className="destination-group">
            <p>Destination: {destination}</p>
            <p>Cost: ${flightsByDestination[destination][0].price}</p>
            <p>Duration: {durationDisplayString(flightsByDestination[destination][0].duration)}</p>
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
        <p>Buy Tickets From {gameState.selectedCity}</p>
        <div className="balance">
          <p>Balance: ${Math.round(gameState.balance)}</p>
        </div>
        <div className="tickets">
          {ticketElements.length > 0 ? ticketElements : <p>No flights available</p>}
        </div>
      </div>
    );
  };
  
  export default TicketShop;