from django.urls import path
from . import views

urlpatterns = [
    path("coins", views.coins_list),
    path("coins/<str:coin_id>", views.coin_data),
    path("coins/charts/<str:coin_id>", views.coin_charts),
    path("search", views.search),
    path("trending", views.trending),
    path("categories", views.categories),
    path("global", views.global_market),
    path("exchanges", views.exchanges),
]
