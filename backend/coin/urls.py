from django.urls import path
from . import views

urlpatterns = [
    path("coins", views.coins_list),
    path("coin", views.coin),
    path("global", views.global_market),
]
