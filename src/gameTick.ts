type Flight = {
    id: string;
    startCity: string;
    endCity: string;
    price: number;
    duration: number;
    startTime: number;
  }
  
  type City = {
    name: string;
    latitude: number;
    longitude: number;
    flights: Flight[];
  }
  
  type GameState = {
    time: number;
    balance: number;
  
    currentCity: string | null;
    currentFlight: string | null;
  
    //Flights the player currently has tickets for
    ticketedFlights: string[];
  
    cities: City[];
    flightMap: Record<string, Flight>;
  
    selectedCity: string | null;
  
    // other state fields
  };

const gameTick = (state: GameState): GameState => {
    // Update time
    state.time += 1;

    // Should the player start a flight?
    if(state.currentFlight === null) {
        for(const flightId of state.ticketedFlights) {
            const flight = state.flightMap[flightId];
            if(flight.startTime == state.time && flight.startCity === state.currentCity) {
                state.currentFlight = flightId;
                break;
            }
        }
    }

    // Should the player finish a flight?
    if(state.currentFlight !== null) {
        const flight = state.flightMap[state.currentFlight];
        if(flight.endCity === state.currentCity && state.time >= flight.startTime + flight.duration) {
            state.currentFlight = null;
            state.currentCity = flight.endCity;
        }
    }

    // Remove ticketed flights that have already departed (the filter determines which ones we *keep*)
    state.ticketedFlights = state.ticketedFlights.filter(flightId => {
        const flight = state.flightMap[flightId];
        return flight.startTime > state.time;
    });


    return state;
}

export type { GameState };
export default gameTick;