from django.conf import settings
import httpx

URL = "https://api.coingecko.com/api/v3/coins/markets"

HEADERS = {
    "accept": "application/json",
    "x-cg-demo-api-key": settings.COINGECKO_API_KEY,
}

params = {
    "vs_currency": "usd",
    "sparkline": True,
    "ids": "",
}


def get_coins_data(coins_ids_str):
    params["ids"] = coins_ids_str

    try:
        return httpx.get(URL, headers=HEADERS, params=params).raise_for_status().json()

    except Exception:
        return []


def group_transactions_by_coin_id(transactions):
    grouped_transactions = {}

    for trx in transactions:
        grouped_transactions.setdefault(trx["coin_id"], []).append(trx)

    return grouped_transactions


def calculate_portfolio_data(transactions):
    if len(transactions) == 0:
        return None

    grouped_transactions = group_transactions_by_coin_id(transactions)
    coins_ids_str = ",".join(grouped_transactions.keys())
    coins = get_coins_data(coins_ids_str)

    if len(coins) == 0:
        return None

    portfolio_data = {}

    return portfolio_data
