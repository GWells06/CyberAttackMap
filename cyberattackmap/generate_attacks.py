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
    "United States": {"lat": 38.0902, "lng": 95.7129},
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


def get_rand_cyber_attack():
    """Generate a random cyber attack."""

    source_country = random.choice(list(COUNTRIES.keys()))

    # Choose a different country as the target country for neatness.
    # Give the list of countries, but not the source country.
    choose_target_country = [
        country for country in COUNTRIES.keys() if country != source_country
    ]

    target_country = random.choice(choose_target_country)

    cyber_attack_type = random.choice(ATTACK_TYPES)

    # Add variablility to actual coordinates so that they are not all the same.
    source_country_lat = COUNTRIES[source_country]["lat"] + random.uniform(-2, 5)
    source_country_lng = COUNTRIES[source_country]["lng"] + random.uniform(-2, 5)
    target_country_lat = COUNTRIES[target_country]["lat"] + random.uniform(-2, 5)
    target_country_lng = COUNTRIES[target_country]["lng"] + random.uniform(-2, 5)

    return {
        "id": random.random.randint(100000, 999999),
        "attack_time": int(time.time()),
        "source_country": source_country,
        "source_country_lat": source_country_lat,
        "source_country_lng": source_country_lng,
        "target_country_lat": target_country_lat,
        "target_country_lng": target_country_lng,
        "cyber_atack_type": cyber_attack_type,
        "attack_severity": random.choice(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
    }


class SimulateCyberAttacks:
    """Simulate cyber attacks at a given rate.
    This will be 3000 a day. Rounded to get 2 a second. May up to show the amount that actually
    happen.

    After doing some math, in order to get 2 seconds between attacks, I'll have to change numbers.

    86400 --> The number of seconds in a day.

    If I used 3000 per day, I would wait 28.8 seconds between attacks, which I don't want. Plus it's
    a decimal.

    So, I'm upping attacks per day to 43200 in order to get an even 2 per second.

    Why 2 per second?
        - After doing some research on cyber attacks, mostly in the US, I found that they estimate there
        to be around 2000-4000 attacks per day, I shot for the middle. These are the main ones you think off,
        DDOS, MALWARE, PHISHING, etc. After shooting for 3000 a day, doing some math, and rounding up; I thought
        2 per second was a good visual aid to show.
    """

    def __init__(self, attacks_per_day=43200):
        self.running = False

        # Calculate the timing. Refer to docstring for specifics.
        self.time_interval = 86400 / attacks_per_day

        self.attack_thread = None

    def start_sim(self):
        """Start the attack simulation."""

        if self.running:
            return

        self.running = True
        self.attack_thread = Thread(target=self.run_simulation)
        self.attack_thread.daemon = True
        self.attack_thread.start()

    def stop_sim(self):
        """Stop the attack simulation."""

        self.running = False
        if self.attack_thread:
            self.attack_thread.join(timeout=1)

    def run_simulation(self):
        "The main simulation loop."

        while self.running:
            cyber_attack = get_rand_cyber_attack()

            # Send to WebSocket channel.
            channel_layer = channels.layers.get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                "attack_updates",
                {"attack_type": "attack_message", "message": cyber_attack},
            )

            # Sleep for the interval calculated.
            time.sleep(self.time_interval)

            attack_simulator = SimulateCyberAttacks()
