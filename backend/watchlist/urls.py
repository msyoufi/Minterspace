from django.urls import path
from .views import watchlist_view

urlpatterns = [
    path("", watchlist_view),
    path("<int:id>", watchlist_view),
]
