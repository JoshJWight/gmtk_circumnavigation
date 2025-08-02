import React, {createContext, useContext, useEffect, useState} from 'react';
import './TicketShop.css';
import type {GameState} from '../gameTick';
import {durationDisplayString, clockDisplayString} from '../gameTick';
import { useGameState } from '../gameContext';

export const TicketShop: React.FC<React.PropsWithChildren> = ({  }) => {
    const gameState = useGameState();

    const currentCityFlights = gameState.cities.find(city => city.name === gameState.currentCity)?.flights || [];
    const filteredFlights = currentCityFlights.filter(
        flight => flight.startTime > gameState.time && flight.startTime <= gameState.time + 1440
    );

    const ticketElements = filteredFlights.map((flight, index) => (
        <div key={index} className="flight">
            <p>Destination: {flight.endCity}</p>
            <p>Cost: ${flight.price.toFixed(2)}</p>
            <p>Departure: {clockDisplayString(flight.startTime)}</p>
            <p>Duration: {durationDisplayString(flight.duration)}</p>
            <button 
                disabled={gameState.ticketedFlights.includes(flight.id)} 
                onClick={() => {}}
            >
                Buy Ticket
            </button>
        </div>
    ));
    
    return (
      <div className="ticket-shop">
        <p>Buy Tickets From {gameState.selectedCity}</p>
        <div className="balance">
          <p>Balance: ${gameState.balance}</p>
        </div>
        <div className="tickets">
          {ticketElements.length > 0 ? ticketElements : <p>No flights available</p>}
        </div>
      </div>
    );
  };
  
  export default TicketShop;