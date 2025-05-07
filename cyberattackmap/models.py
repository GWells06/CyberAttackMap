from django.db import models

# Create your models here.


class CyberAttackType(models.Model):
    """Define the attack types that will be used in this project."""

    ATTACK_TYPES = [
        ("DDOS", "DDoS"),
        ("MALWARE", "Malware"),
        ("PHISHING", "Phishing"),
        ("BRUTE_FORCE", "Brute Force"),
    ]

    cyber_attack_type = models.CharField(max_length=20, choices=ATTACK_TYPES)
    source_country = models.CharField(max_length=100)
    target_country = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    attack_timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.cyber_attack_typeattack_type} attack from {self.source_country} to {self.target_country}"
