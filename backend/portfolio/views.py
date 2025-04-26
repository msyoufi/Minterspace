from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .serializers import PortfolioSerializer, TransactionSerializer
from .models import Portfolio, Transaction
from django.shortcuts import get_object_or_404
from .helpers import calculate_portfolio_data


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
    serializer = PortfolioSerializer(portfolio, data=data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    serializer.save(user=user)

    return Response(serializer.data, status=200)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def portfolio_data_view(request, portfolio_id=None):
    if portfolio_id is None:
        return Response({"error": "portfolio_id must be provided"}, status=400)

    transactions = Transaction.objects.filter(portfolio=portfolio_id).values()
    portfolio_data = calculate_portfolio_data(transactions)

    return Response(portfolio_data, status=200)


# TODO
@api_view(["POST", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def transaction_view(request, transaction_id=None):
    if request.method == "POST":
        return create_transaction(request.data)

    if transaction_id is None:
        return Response({"error": "transaction_id must be provided"}, status=400)

    if request.method == "PATCH":
        return update_transaction(transaction_id, request.data)

    if request.method == "DELETE":
        return delete_transaction(transaction_id)


def create_transaction(data):
    return Response(status=201)


def update_transaction(transaction_id, data):
    return Response(status=200)


def delete_transaction(transaction_id):
    return Response(status=204)
