import json
from math import floor
from geopy.distance import geodesic
import random

# Load the contents of cities.jsonl
def load_cities(file_path):
    with open(file_path, 'r') as file:
        return json.loads(file.read())




def distanceMatrix(cities):
    n = len(cities)
    matrix = [[0] * n for _ in range(n)]
    
    for i in range(n):
        for j in range(i + 1, n):
            dist = geodesic([cities[i]['latitude'], cities[i]['longitude']], [cities[j]['latitude'], cities[j]["longitude"]]).km
            matrix[i][j] = dist
            matrix[j][i] = dist
            
    return matrix


def iterative_hopping(cities, n, max_distance=1000):
    # Repeating n times,
    # Pick a random start and end city
    # If the distance between them is less than max, create a connection
    # Otherwise find the city within max distance of the start city that is closest to the end city and create a connection to that,
    # continuing until the end is reached
    for city in cities:
        city['connections'] = set()

    distances = distanceMatrix(cities)

    for _ in range(n):
        start_index = random.randint(0, len(cities) - 1)
        end_index = random.randint(0, len(cities) - 1)

        while start_index == end_index:
            end_index = random.randint(0, len(cities) - 1)

        start_city = cities[start_index]
        end_city = cities[end_index]

        current_city = start_city
        route_description = start_city["name"]
        while current_city != end_city:
            distance_to_end = distances[cities.index(current_city)][cities.index(end_city)]
            if distance_to_end < max_distance:
                current_city['connections'].add(end_city['name'])
                end_city['connections'].add(current_city['name'])
                route_description += f" -> {end_city['name']}"
                break

            # Find the closest city to the end city within max distance
            closest_city = None
            closest_distance = float('inf')
            for i, city in enumerate(cities):
                if city != current_city and distances[cities.index(current_city)][i] < max_distance:
                    dist_to_end = distances[i][cities.index(end_city)]
                    if dist_to_end < closest_distance and dist_to_end < distance_to_end:
                        closest_distance = dist_to_end
                        closest_city = city
            
            if closest_city is None:
                # Find the closest city to the current one that is closer to the end city
                closest_distance = float('inf')
                for i, city in enumerate(cities):
                    if city != current_city:
                        dist_to_this = distances[cities.index(current_city)][i]
                        dist_to_end = distances[i][cities.index(end_city)]
                        if dist_to_end < distance_to_end and dist_to_this < closest_distance:
                            closest_distance = dist_to_this
                            closest_city = city

            if closest_city:
                current_city['connections'].add(closest_city['name'])
                closest_city['connections'].add(current_city['name'])
                current_city = closest_city
                route_description += f" -> {closest_city['name']}"
            else:
                print(f"No further connections possible from {current_city['name']} to {end_city['name']}.")
                break
        print(f"Route: {route_description}")

def iterative_hopping2(cities, n, avgRoutesPerCity, max_distance=1000):
    # Repeating n times,
    # Pick a random start and end city
    # If the distance between them is less than max, create a connection
    # Otherwise find the city within max distance of the start city that is closest to the end city and create a connection to that,
    # continuing until the end is reached
    for city in cities:
        city['connections'] = set()

    city_name_to_index = {city['name']: i for i, city in enumerate(cities_data)}
    distances = distanceMatrix(cities)
    connectionWeights = [[0.0] * len(cities) for _ in cities]

    for _ in range(n):
        start_index = random.randint(0, len(cities) - 1)
        end_index = random.randint(0, len(cities) - 1)

        while start_index == end_index:
            end_index = random.randint(0, len(cities) - 1)

        start_city = cities[start_index]
        end_city = cities[end_index]

        current_city = start_city
        route_description = start_city["name"]
        while current_city != end_city:
            distance_to_end = distances[cities.index(current_city)][cities.index(end_city)]
            if distance_to_end < max_distance:
                connectionWeights[city_name_to_index[current_city['name']]][city_name_to_index[end_city['name']]] += 1
                connectionWeights[city_name_to_index[end_city['name']]][city_name_to_index[current_city['name']]] += 1
                route_description += f" -> {end_city['name']}"
                break

            # Find the closest city to the end city within max distance
            closest_city = None
            closest_distance = float('inf')
            for i, city in enumerate(cities):
                if city != current_city and distances[cities.index(current_city)][i] < max_distance:
                    dist_to_end = distances[i][cities.index(end_city)]
                    if dist_to_end < closest_distance and dist_to_end < distance_to_end:
                        closest_distance = dist_to_end
                        closest_city = city
            
            if closest_city is None:
                # Find the closest city to the current one that is closer to the end city
                candidate_cities = []
                closest_distance = float('inf')
                for i, city in enumerate(cities):
                    if city != current_city:
                        dist_to_end = distances[i][cities.index(end_city)]
                        if dist_to_end < distance_to_end:
                            dist_to_this = distances[cities.index(current_city)][i]
                            candidate_cities.append((dist_to_this, city))

                candidate_cities.sort(key=lambda x: x[0])
                n_choices = min(3, len(candidate_cities))
                choices = [candidate[1] for candidate in candidate_cities[:n_choices]]
                weights = [15000-candidate_cities[i][0] for i in range(n_choices)]
                closest_city = random.choices(choices, weights=weights, k=1)[0] if choices else None

            if closest_city:
                connectionWeights[city_name_to_index[current_city['name']]][city_name_to_index[closest_city['name']]] += 1
                connectionWeights[city_name_to_index[closest_city['name']]][city_name_to_index[current_city['name']]] += 1
                current_city = closest_city
                route_description += f" -> {closest_city['name']}"
            else:
                print(f"No further connections possible from {current_city['name']} to {end_city['name']}.")
                break
        print(f"Route: {route_description}")


    for i in range(len(cities)):
        average_weight = sum(connectionWeights[i]) / (len(cities) - 1) if len(cities) > 1 else 0
        for j in range(len(cities)):
            connectionWeights[i][j] /= average_weight
    
    desiredConnections = avgRoutesPerCity * len(cities)

    candidate_connections = []
    for i in range(len(cities)):
        for j in range(i + 1, len(cities)):
            if connectionWeights[i][j] > 0:
                candidate_connections.append((i, j, connectionWeights[i][j]))
    candidate_connections.sort(key=lambda x: x[2], reverse=True)
    connections_count = 0
    for i, j, weight in candidate_connections:
        if connections_count >= desiredConnections:
            break
        cities[i]['connections'].add(cities[j]['name'])
        cities[j]['connections'].add(cities[i]['name'])
        connections_count += 1


        

if __name__ == "__main__":
    cities_file = './cities.json'
    cities_data = load_cities(cities_file)
    city_name_to_index = {city['name']: i for i, city in enumerate(cities_data)}
    iterative_hopping2(cities_data, 10000, avgRoutesPerCity=3, max_distance=3000)

    #Some connections that come up in the algorithm allow for overly-easy circumnavigation around the arctic, so remove them
    banned_connections = [("Seattle", "London"), ("Moscow", "Tokyo")]
    for ban in banned_connections:
        if ban[0] in city_name_to_index and ban[1] in city_name_to_index:
            cities_data[city_name_to_index[ban[0]]]['connections'].discard(ban[1])
            cities_data[city_name_to_index[ban[1]]]['connections'].discard(ban[0])

    distances = distanceMatrix(cities_data)

    def departuresForDistance(distance):
        if distance < 1000:
            return 10
        elif distance < 2000:
            return 8
        elif distance < 3000:
            return 6
        elif distance < 4000:
            return 4
        elif distance < 5000:
            return 3
        elif distance < 6000:
            return 2
        else:
            return 1

    for city in cities_data:
        connections = []
        for i, connected_city in enumerate(city['connections']):
            distance = distances[city_name_to_index[city['name']]][city_name_to_index[connected_city]]
            n_departures = departuresForDistance(distance)
            guaranteedInterval = 1440 / (n_departures+1) / 2
            splitRemainder = 1440 - (guaranteedInterval * (n_departures+1))
            splits = [random.random() for _ in range(n_departures)]
            splits.append(0)
            splits.sort()
            departures = []
            sum = 0
            for i in range(n_departures):
                fractionOfRemainder = splits[i+1]-splits[i]
                sum += fractionOfRemainder * splitRemainder + guaranteedInterval
                departures.append(sum)

            sum = 0
            connections.append({
                'destination': connected_city,
                'distance': distance,
                'departures': departures
            })
        city['connections'] = connections

    with open('src/cities_with_routes.json', 'w') as outfile:
        json.dump(cities_data, outfile, indent=4)