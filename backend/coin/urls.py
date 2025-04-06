from django.urls import path
from .views import coins_list, coin

urlpatterns = [
    path("coins", coins_list),
    path("coin", coin),
]
