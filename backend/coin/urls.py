from django.urls import path
from . import views

urlpatterns = [
    path("coins", views.coins_list),
    path("coins/<str:coin_id>", views.coin_data),
    path("coins-charts/<str:coin_id>", views.coin_charts),
    path("search", views.search),
    path("global", views.global_market),
]
