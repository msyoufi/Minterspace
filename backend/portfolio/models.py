from django.db import models


class Watchlist(models.Model):
    user = models.ForeignKey(
        "user.User",
        on_delete=models.CASCADE,
        related_name="watchlist",
    )
    coins = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"{self.user} - {self.id}"

    def serialize(self):
        return {
            "id": self.id,
            "coins": self.coins,
        }


class Portfolio(models.Model):
    user = models.ForeignKey(
        "user.User",
        on_delete=models.CASCADE,
        related_name="portfolio",
    )

    def __str__(self):
        return f"{self.user} - {self.id}"

    def serialize(self):
        return {
            "id": self.id,
            "transactions": [tx.serialize() for tx in self.transactions.all()],
        }


class Transaction(models.Model):
    portfolio = models.ForeignKey(
        Portfolio,
        on_delete=models.CASCADE,
        related_name="transactions",
    )
    coin_id = models.CharField(max_length=64)
    type = models.CharField(max_length=4, choices=[("buy", "Buy"), ("sell", "Sell")])
    quantity = models.FloatField()
    pricePerCoin = models.FloatField()
    date = models.DateTimeField()

    def __str__(self):
        return f"{self.coin_id} - {self.date}"

    def serialize(self):
        return {
            "id": self.id,
            "coin_id": self.coin_id,
            "type": self.type,
            "quantity": self.quantity,
            "pricePerCoin": self.pricePerCoin,
            "date": self.date.isoformat(),
        }
