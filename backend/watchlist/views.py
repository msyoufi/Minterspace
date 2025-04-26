from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Watchlist
from .serializers import WatchlistSerializer
from django.shortcuts import get_object_or_404


@api_view(["GET", "POST", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def watchlist_view(request, watchlist_id=None):
    user = request.user

    if request.method == "GET":
        return get_all_watchlists(user)

    if request.method == "POST":
        return create_watchlist(user, request.data)

    if watchlist_id is None:
        return Response({"error": "watchlist_id must be provided"}, status=400)

    watchlist = get_object_or_404(Watchlist, pk=watchlist_id)

    if watchlist.user != user:
        return Response(status=403)

    if request.method == "PATCH":
        return update_watchlist(user, watchlist, request.data)

    if request.method == "DELETE":
        watchlist.delete()
        return Response(status=204)


def get_all_watchlists(user):
    user_watchlists = Watchlist.objects.filter(user=user)
    serializer = WatchlistSerializer(user_watchlists, many=True)

    return Response(serializer.data, status=200)


def create_watchlist(user, data):
    serializer = WatchlistSerializer(data=data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    serializer.save(user=user)

    return Response(serializer.data, status=201)


def update_watchlist(user, watchlist, data):
    serializer = WatchlistSerializer(watchlist, data=data, partial=True)

    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    serializer.save(user=user)

    return Response(serializer.data, status=200)
