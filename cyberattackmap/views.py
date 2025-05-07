from django.shortcuts import render
from django.http import JsonResponse
from .generate_attacks import get_rand_cyber_attack


# Create your views here.
def index(request):
    """Will be the main view."""

    return render(request, "cyberattackmap/index.html")


def get_cyber_attacks(request):
    """The API endpoint to get a small set of 'random' attacks to start."""

    # Generate a small set of attacks. # Limit to 100 at max.
    cyber_attack_count = min(int(request.GET.get("cyber_attack_count", 10)), 100)
    cyber_attacks = [get_rand_cyber_attack() for _ in range(cyber_attack_count)]

    return JsonResponse({"success": True, "cyber_attacks": cyber_attacks})
