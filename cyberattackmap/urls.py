from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("api/attacks/", views.get_cyber_attacks, name="get_cyber_attacks"),
]
