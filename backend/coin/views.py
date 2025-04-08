from rest_framework.decorators import api_view
from .coingecko_fetch import get


@api_view()
def coins_list(request):
    params = request.query_params
    return get("coins/markets", params)


coin_details_params = {
    "localization": False,
    "tickers": False,
    "community_data": False,
    "developer_data": False,
}


@api_view()
def coin_data(request, coin_id):
    return get(f"coins/{coin_id}", params=coin_details_params)


@api_view()
def coin_charts(request, coin_id):
    params = request.query_params
    return get(f"coins/{coin_id}/market_chart", params)


@api_view()
def search(request):
    params = request.query_params
    return get("search", params)


@api_view()
def global_market(request):
    return get("global", params=None)
