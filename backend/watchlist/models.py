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
