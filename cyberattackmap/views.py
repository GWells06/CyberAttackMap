from django.shortcuts import render
from django.http import JsonResponse
import random
import time

# Countries with their approximate latitude and longitude
COUNTRIES = {
    "United States": {"lat": 38.0902, "lng": 95.7129},
    "China": {"lat": 35.8617, "lng": 104.1954},
    "Russia": {"lat": 61.5240, "lng": 105.3188},
    "India": {"lat": 20.5937, "lng": 78.9629},
    "Brazil": {"lat": 14.2350, "lng": 51.9253},
    "United Kingdom": {"lat": 55.3781, "lng": 3.4360},
    "Germany": {"lat": 51.1657, "lng": 10.4515},
    "Japan": {"lat": 36.2048, "lng": 138.2529},
    "Canada": {"lat": 56.1304, "lng": 106.3468},
    "Australia": {"lat": 25.2744, "lng": 133.7751},
    "France": {"lat": 46.2276, "lng": 2.2137},
    "South Korea": {"lat": 35.9078, "lng": 127.7669},
    "Israel": {"lat": 31.0461, "lng": 34.8516},
    "Iran": {"lat": 32.4279, "lng": 53.6880},
    "North Korea": {"lat": 40.3399, "lng": 127.5101},
}

# Major attack types
ATTACK_TYPES = ["DDOS", "MALWARE", "PHISHING", "BRUTE FORCE"]


def get_random_cyber_attack():
    """Generate a random cyber attack."""
    source_country = random.choice(list(COUNTRIES.keys()))

    # Choose a different country for the target country.
    possible_target_country = [
        countries for countries in COUNTRIES.keys() if countries != source_country
    ]
    target_country = random.choice(possible_target_country)

    attack_type = random.choice(ATTACK_TYPES)

    # Add some variability to the country coordinates.
    source_country_lat = COUNTRIES[source_country]["lat"] + random.uniform(-2, 5)
    source_country_lng = COUNTRIES[source_country]["lng"] + random.uniform(-2, 5)
    target_country_lat = COUNTRIES[target_country]["lat"] + random.uniform(-2, 5)
    target_country_lng = COUNTRIES[target_country]["lng"] + random.uniform(-2, 5)

    return {
        "id": random.randint(100000, 999999),
        "attack_timestamp": int(time.time()),
        "source_country": source_country,
        "source_lat": source_country_lat,
        "source_lng": source_country_lng,
        "target_country": target_country,
        "target_lat": target_country_lat,
        "target_lng": target_country_lng,
        "attack_type": attack_type,
        "severity": random.choice(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
    }


def index(request):
    """Main map view"""
    return render(request, "cyberattackmap/index.html")


def get_cyber_attacks(request):
    """API endpoint to get a small number of 'random' attacks."""

    # Generate a small number of attacks. Limit to 100 max.
    attack_count = min(int(request.GET.get("count", 10)), 100)
    attacks = [get_random_cyber_attack() for _ in range(attack_count)]

    return JsonResponse({"success": True, "attacks": attacks})
