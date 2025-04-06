from django.urls import path
from . import views

urlpatterns = [
    path("coins", views.coins_list),
    path("coins/<str:coin_id>", views.coin),
    path("global", views.global_market),
]
