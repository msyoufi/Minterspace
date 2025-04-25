from rest_framework import serializers
from .models import Portfolio, Transaction


class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ("id", "is_main", "name")
        read_only_fields = ("id",)
