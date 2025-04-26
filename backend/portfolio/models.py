from django.db import models


class Portfolio(models.Model):
    user = models.ForeignKey(
        "user.User",
        on_delete=models.CASCADE,
        related_name="portfolio",
    )
    is_main = models.BooleanField(default=False)
    name = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.user} - {self.name} - {self.id}"


class Transaction(models.Model):
    portfolio = models.ForeignKey(
        Portfolio,
        on_delete=models.CASCADE,
        related_name="transactions",
    )
    coin_id = models.CharField(max_length=64)
    type = models.CharField(max_length=4, choices=[("buy", "Buy"), ("sell", "Sell")])
    quantity = models.FloatField()
    coin_price_usd = models.FloatField()
    date = models.DateTimeField()

    def __str__(self):
        return f"{self.portfolio} - {self.coin_id} - {self.date}"
