from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .serializers import PortfolioSerializer
from .models import Portfolio


@api_view(["GET", "POST", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def portfolio_view(request, id=None):
    user = request.user

    if request.method == "GET":
        return get_all_portfolios(user)

    if request.method == "POST":
        return create_portfolio(user, request.data)

    if request.method == "PATCH":
        return update_portfolio(user, id, request.data)

    if request.method == "DELETE":
        return delete_portfolio(user, id)


def get_all_portfolios(user):
    user_portfolios = Portfolio.objects.filter(user=user)
    serializer = PortfolioSerializer(user_portfolios, many=True)

    return Response(serializer.data, status=200)


def create_portfolio(user, data):
    return Response(status=200)


def update_portfolio(user, portfolio_id, data):
    return Response(status=200)


def delete_portfolio(user, portfolio_id):
    return Response(status=200)
