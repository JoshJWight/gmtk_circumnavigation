import citiesWithRoutes from './cities_with_routes.json';

export const shortClockDisplayString = (time: number): string => {
    const hours = Math.floor(time / 60) % 24;
    const minutes = Math.floor(time % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export const clockDisplayString = (time: number): string => {
    const days = ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const dayIndex = Math.floor(time / (24 * 60)) % 5; // 5 days in the game
    const hours = Math.floor(time / 60) % 24;
    const minutes = Math.floor(time % 60);
    return `${days[dayIndex]} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export const durationDisplayString = (time: number): string => {
    const hours = Math.floor(time / 60);
    const minutes = Math.floor(time % 60);
    return `${hours}h ${minutes}m`;
}

// In game data types

export type Flight = {
    id: string;
    startCity: string;
    endCity: string;
    price: number;
    duration: number;
    startTime: number;
  }
  
export type City = {
    name: string;
    latitude: number;
    longitude: number;
    flights: Flight[];
  }
  
export type GameState = {
    time: number; //In-universe minutes
    balance: number;
  
    currentCity: string | null;
    currentFlight: string | null;
  
    //Flights the player currently has tickets for
    ticketedFlights: string[];
  
    cities: City[];
    flightMap: Record<string, Flight>;
  
    selectedCity: string | null;
  
    simSpeed: number; //Number of minutes per tick
  };

export const initializeGameState = (startCity: string): GameState => {
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

            //TODO this can get more sophisticated
            let price = Math.round(route.distance * 0.1);

            const airplaneSpeed = 900;

            //but add 15 minutes for taxiing
            let duration = (route.distance / airplaneSpeed * 60) + 15;

            for(let day = 0; day < 5; day++) {
                for (const departureTime of route.departures) {
                    const departure = day * 24 * 60 + departureTime; // Departure time in minutes from the start of the game
                    const flightId = `${city.name}-${route.destination}-${departure}`;

                    const flight: Flight = {
                        id: flightId,
                        startCity: city.name,
                        endCity: route.destination,
                        price: price,
                        duration: duration,
                        startTime: departure
                    };
                    city.flights.push(flight);
                    flightMap[flightId] = flight;
                }
            }

        }
    }

    return {
        time: 0,
        balance: 5000,
        currentCity: startCity,
        currentFlight: null,
        ticketedFlights: [],
        cities,
        flightMap,
        selectedCity: startCity,
        simSpeed: 1
    };
}


const gameTick = (state: GameState): GameState => {
    // Update time
    const newTime = state.time + state.simSpeed;
    let newCurrentFlight = state.currentFlight;
    let newCurrentCity = state.currentCity;

    // Should the player start a flight?
    if(newCurrentFlight === null) {
        for(const flightId of state.ticketedFlights) {
            const flight = state.flightMap[flightId];
            if(flight.startTime <= newTime && flight.startCity === newCurrentCity) {
                newCurrentFlight = flightId;
                break;
            }
        }
    }

    // Should the player finish a flight?
    if(newCurrentFlight !== null) {
        const flight = state.flightMap[newCurrentFlight];
        if(newTime >= flight.startTime + flight.duration) {
            newCurrentFlight = null;
            newCurrentCity = flight.endCity;
        }
    }

    // Remove ticketed flights that have already departed (the filter determines which ones we *keep*)
    const newTicketedFlights = state.ticketedFlights.filter(flightId => {
        const flight = state.flightMap[flightId];
        return flight.startTime > newTime;
    });

    return {
        ...state,
        time: newTime,
        currentFlight: newCurrentFlight,
        currentCity: newCurrentCity,
        ticketedFlights: newTicketedFlights
    };
}

export default gameTick;