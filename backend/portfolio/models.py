from django.db import models


class Portfolio(models.Model):
    user = models.ForeignKey(
        "user.User",
        on_delete=models.CASCADE,
        related_name="portfolio",
    )

    def __str__(self):
        return f"{self.user} - {self.id}"


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
