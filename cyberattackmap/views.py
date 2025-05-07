from django.shortcuts import render
import json
import random
import time
from datetime import datetime, timedelta
from django.http import JsonResponse
from .models import CyberAttackType

# Create your views here.

# Countries with their coordinates
COUNTRIES = {
    "United States": {"lat": 38.0902, "lng": -95.7129},
    "China": {"lat": 35.8617, "lng": 104.1954},
    "Russia": {"lat": 61.5240, "lng": 105.3188},
    "India": {"lat": 20.5937, "lng": 78.9629},
    "Brazil": {"lat": 14.2350, "lng": 51.9253},
    "United Kingdom": {"lat": 55.3781, "lng": 3.4360},
    "Germany": {"lat": 51.1657, "lng": 10.4515},
    "Japan": {"lat": 36.2048, "lng": 138.2529},
    "France": {"lat": 46.2276, "lng": 2.2137},
    "Canada": {"lat": 56.1304, "lng": 106.3468},
    "Australia": {"lat": 25.2744, "lng": 133.7751},
    "South Korea": {"lat": 35.9078, "lng": 127.7669},
    "Israel": {"lat": 31.0461, "lng": 34.8516},
    "Iran": {"lat": 32.4279, "lng": 53.6880},
    "Ukraine": {"lat": 48.3794, "lng": 31.1656},
}

ATTACK_TYPES = ["DDOS", "MALWARE", "PHISHING", "BRUTE_FORCE"]


def index(request):
    return render(request, "cyberattackmap/index.html")


def get_cyber_attacks(request):
    """Generate and return 'random' cyber attack data."""

    total_count = int(request.GET.get("count", 10))

    # Generate attacks.
    cyber_attacks = []
    countries = list(COUNTRIES.keys())

    # Using '_'. Don't need the counter.
    for _ in range(total_count):
        target_country = random.choice(countries)
        target_coordinates = COUNTRIES[target_country]

        # Add some random variation to the actual coordinates.
        lat_variation = random.uniform(-2, 2)
        lng_variation = random.uniform(-2, 2)

        attack = {
            "attack_type": random.choice(ATTACK_TYPES),
            "target_country": target_country,
            "latitude": target_coordinates["lat"] + lat_variation,
            "longitude": target_coordinates["lng"] + lng_variation,
            "attack_timestamp": datetime.now().isoformat,
        }

        cyber_attacks.append(attack)

    return JsonResponse({"Attacks": cyber_attacks})
