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


def calculate_portfolio_data(transactions):
    if not len(transactions):
        return None

    # Prepare neccessary data
    transactions_by_coin = group_transactions_by_coin(transactions)

    coins_ids_str = ",".join(transactions_by_coin.keys())
    coins = fetch_coins_market_data(coins_ids_str)

    if not len(coins):
        return None

    # Define accumulators
    total_balance = total_profit_loss = total_portfolio_buy_value = 0
    allocation_chart = []
    assets = []

    for coin_id, transactions in transactions_by_coin.items():
        coin = coins.get(coin_id)

        if coin is None:
            continue

        asset_values = calculate_asset_values(transactions, coin["current_price"])

        # Add asset
        asset = create_asset(asset_values, coin)
        assets.append(asset)

        # Add asset chart data point
        if asset_values["current_quantity"] > 0:
            allocation_chart.append(
                {
                    "name": coin["symbol"].upper(),
                    "value": asset_values["current_value"],
                }
            )

        # Add asset values to totals
        total_portfolio_buy_value += asset_values["total_buy_value"]
        total_balance += asset_values["current_value"]
        total_profit_loss += asset_values["profit_loss"]

    stats = create_portfolio_stats(
        assets, total_balance, total_profit_loss, total_portfolio_buy_value
    )

    return {
        "stats": stats,
        "allocation_chart": allocation_chart,
        "assets": assets,
        "transactions_by_coin": transactions_by_coin,
    }


def group_transactions_by_coin(transactions):
    grouped = {}

    for trx in transactions:
        grouped.setdefault(trx["coin_id"], []).append(trx)

    return grouped


def fetch_coins_market_data(coins_ids_str):
    params["ids"] = coins_ids_str

    try:
        coins = httpx.get(URL, headers=HEADERS, params=params).raise_for_status().json()
        coins_by_id = {coin["id"]: coin for coin in coins}

        return coins_by_id

    except Exception:
        return []


def calculate_asset_values(transactions, current_coin_price):
    buy_quantity, sell_quantity, total_buy_value, total_sell_value = (
        reduce_transactions(transactions)
    )

    current_quantity = buy_quantity - sell_quantity
    current_value = current_quantity * current_coin_price
    avrg_buy_price = total_buy_value / buy_quantity if buy_quantity else 0

    realized_profit_loss = total_sell_value - (sell_quantity * avrg_buy_price)
    unrealized_profit_loss = current_value - (current_quantity * avrg_buy_price)

    profit_loss = realized_profit_loss + unrealized_profit_loss
    profit_loss_percentage = (
        profit_loss * 100 / total_buy_value if total_buy_value else 0
    )

    return {
        "total_buy_value": total_buy_value,
        "current_quantity": current_quantity,
        "current_value": current_value,
        "avrg_buy_price": avrg_buy_price,
        "profit_loss": profit_loss,
        "profit_loss_percentage": profit_loss_percentage,
    }


def reduce_transactions(transactions):
    buy_quantity = sell_quantity = total_buy_value = total_sell_value = 0

    for trx in transactions:
        quantity = trx["quantity"]
        value = quantity * trx["coin_price_usd"]

        if trx["type"] == "buy":
            buy_quantity += quantity
            total_buy_value += value

        else:
            sell_quantity += quantity
            total_sell_value += value

    return buy_quantity, sell_quantity, total_buy_value, total_sell_value


def create_asset(asset_values, coin):
    return {
        "coin_id": coin["id"],
        "name": coin["name"],
        "symbol": coin["symbol"],
        "image": coin["image"],
        "current_price": coin["current_price"],
        "price_change_percentage_24h": coin["price_change_percentage_24h"],
        "avrg_buy_price": asset_values["avrg_buy_price"],
        "current_quantity": asset_values["current_quantity"],
        "current_value": asset_values["current_value"],
        "profit_loss": asset_values["profit_loss"],
        "profit_loss_percentage": asset_values["profit_loss_percentage"],
        "sparkline": coin["sparkline_in_7d"]["price"],
    }


def create_portfolio_stats(
    assets, total_balance, total_profit_loss, total_portfolio_buy_value
):
    total_profit_loss_percentage = (
        total_profit_loss * 100 / total_portfolio_buy_value
        if total_portfolio_buy_value
        else 0
    )

    assets.sort(key=lambda asset: asset["profit_loss"], reverse=True)

    return {
        "total_balance": total_balance,
        "total_profit_loss": total_profit_loss,
        "total_profit_loss_percentage": total_profit_loss_percentage,
        "top_gainer_id": assets[0]["coin_id"],
        "worst_gainer_id": assets[-1]["coin_id"],
    }
