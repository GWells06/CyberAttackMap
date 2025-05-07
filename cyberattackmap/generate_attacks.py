# generate_attack.py
# Grant Wells
# Create and generate a 'random' attack.

import random
import time
import json
from threading import Thread
import asyncio
import channels.layers
from asgiref.sync import async_to_sync

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

ATTACK_TYPES = ["DDOS", "MALWARE", "PHISHING", "BRUTE FORCE"]


class CyberAttackType(models.Model):
    """Define the attack types that will be used in this project."""

    cyber_attack_type = models.CharField(max_length=20, choices=ATTACK_TYPES)
    source_country = models.CharField(max_length=100)
    target_country = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    attack_timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.cyber_attack_typeattack_type} attack from {self.source_country} to {self.target_country}"
