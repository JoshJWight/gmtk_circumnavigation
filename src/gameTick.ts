import citiesWithRoutes from './cities_with_routes.json';

// In game data types

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
    time: number; //In-universe minutes
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

const initializeGameState = (startCity: string): GameState => {
    const cities: City[] = [];
    const flightMap: Record<string, Flight> = {};

    for(const cityData of citiesWithRoutes) {
        const city: City = {
            name: cityData.name,
            latitude: cityData.latitude,
            longitude: cityData.longitude,
            flights: []
        };
        cities.push(city);

        for(const route of cityData.connections) {
            const flightId = `${city.name}-${route.destination}-${route.departure_time}`;

            //TODO this can get more sophisticated
            let price = route.distance * 0.1;
            //500 km/h, but add 15 minutes for taxiing
            let duration = (route.distance / 500 * 60) + 15;

            const flight: Flight = {
                id: flightId,
                startCity: city.name,
                endCity: route.destination,
                price: price,
                duration: duration,
                startTime: route.departure_time
            };
            city.flights.push(flight);
            flightMap[flightId] = flight;

            //TODO generate extra copies of this flight for later days
        }
    }

    return {
        time: 0,
        balance: 1000,
        currentCity: startCity,
        currentFlight: null,
        ticketedFlights: [],
        cities,
        flightMap,
        selectedCity: null
    };
}


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