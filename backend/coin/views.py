from rest_framework.decorators import api_view
from .coingecko_fetch import get


@api_view()
def coins_list(request):
    params = request.query_params
    return get("coins/markets", params)


@api_view()
def coin(request):
    params = request.query_params
    return get("coins", params)
