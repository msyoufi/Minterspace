from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .serializers import PortfolioSerializer, TransactionSerializer
from .models import Portfolio, Transaction
from django.shortcuts import get_object_or_404
from .portfolio_calculator import calculate_portfolio_data


@api_view(["GET", "POST", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def portfolio_view(request, portfolio_id=None):
    user = request.user

    if request.method == "GET":
        return get_all_portfolios(user)

    if request.method == "POST":
        return create_portfolio(user, request.data)

    if portfolio_id is None:
        return Response({"error": "portfolio_id must be provided"}, status=400)

    portfolio = get_object_or_404(Portfolio, pk=portfolio_id)

    if portfolio.user != user:
        return Response(status=403)

    if request.method == "PATCH":
        return update_portfolio(user, portfolio, request.data)

    if request.method == "DELETE":
        portfolio.delete()
        return Response(status=204)


def get_all_portfolios(user):
    user_portfolios = Portfolio.objects.filter(user=user)
    serializer = PortfolioSerializer(user_portfolios, many=True)

    return Response(serializer.data, status=200)


def create_portfolio(user, data):
    serializer = PortfolioSerializer(data=data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    serializer.save(user=user)

    return Response(serializer.data, status=201)


def update_portfolio(user, portfolio, data):
    serializer = PortfolioSerializer(portfolio, data=data, partial=True)

    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    serializer.save(user=user)

    return Response(serializer.data, status=200)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def portfolio_data_view(request, portfolio_id=None):
    if portfolio_id is None:
        return Response({"error": "portfolio_id must be provided"}, status=400)

    portfolio_data = get_portfolio_data(portfolio_id)

    return Response(portfolio_data, status=200)


@api_view(["POST", "DELETE"])
@permission_classes([IsAuthenticated])
def transaction_view(request, portfolio_id=None, transaction_id=None):
    if portfolio_id is None:
        return Response({"error": "portfolio_id must be provided"}, status=400)

    try:
        portfolio = get_object_or_404(Portfolio, pk=portfolio_id)

        if portfolio.user != request.user:
            return Response(status=403)

    except:
        return Response(status=404)

    status = 200

    if request.method == "POST":
        serializer = TransactionSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        serializer.save(portfolio=portfolio)
        status = 201

    elif request.method == "DELETE":
        if transaction_id is None:
            return Response({"error": "transaction_id must be provided"}, status=400)

        try:
            transaction = get_object_or_404(Transaction, pk=transaction_id)

        except:
            return Response(status=404)

        transaction.delete()

    portfolio_data = get_portfolio_data(portfolio_id)

    return Response(portfolio_data, status=status)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def asset_view(request, portfolio_id=None, coin_id=None):
    if portfolio_id is None or coin_id is None:
        return Response(
            {"error": "portfolio_id and coin_id must be provided"},
            status=400,
        )

    try:
        portfolio = get_object_or_404(Portfolio, pk=portfolio_id)

        if portfolio.user != request.user:
            return Response(status=403)

        transactions = Transaction.objects.filter(portfolio=portfolio, coin_id=coin_id)
        transactions.delete()

        portfolio_data = get_portfolio_data(portfolio_id)

        return Response(portfolio_data, status=200)

    except:
        return Response(status=404)


def get_portfolio_data(portfolio_id):
    transactions = Transaction.objects.filter(portfolio=portfolio_id).values()
    portfolio_data = calculate_portfolio_data(transactions)

    return portfolio_data
