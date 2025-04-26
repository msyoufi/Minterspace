from django.urls import path
from .views import watchlist_view

urlpatterns = [
    path("", watchlist_view),
    path("<int:watchlist_id>", watchlist_view),
]
