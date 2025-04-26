from rest_framework import serializers
from .models import Portfolio, Transaction


class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ("id", "is_main", "name")


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = (
            "id",
            "coin_id",
            "type",
            "quantity",
            "coin_price_usd",
            "date",
        )
