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
    # Otherwise find the city within max distance of the start city that is closes to the end city and create a connection to that,
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
        

if __name__ == "__main__":
    cities_file = './cities.json'
    cities_data = load_cities(cities_file)
    city_name_to_index = {city['name']: i for i, city in enumerate(cities_data)}
    iterative_hopping(cities_data, 1000, max_distance=3000)

    distances = distanceMatrix(cities_data)

    for city in cities_data:
        connections = []
        for i, connected_city in enumerate(city['connections']):
            connections.append({
                'destination': connected_city,
                'distance': distances[city_name_to_index[city['name']]][city_name_to_index[connected_city]],
                'departure_time': floor(i * 1440 / len(city['connections']))
            })
        city['connections'] = connections

    with open('src/cities_with_routes.json', 'w') as outfile:
        json.dump(cities_data, outfile, indent=4)