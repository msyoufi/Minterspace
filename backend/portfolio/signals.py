from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Portfolio, Transaction


@receiver(post_save, sender=Transaction)
def on_transaction_save(sender, instance, created, **kwargs):
    sync_portfolio_coins(instance.portfolio_id)


@receiver(post_delete, sender=Transaction)
def on_transaction_delete(sender, instance, **kwargs):
    sync_portfolio_coins(instance.portfolio_id)


def sync_portfolio_coins(portfolio_id):
    try:
        portfolio = Portfolio.objects.get(pk=portfolio_id)

        actual_coins = list(
            Transaction.objects.filter(portfolio=portfolio)
            .values_list("coin_id", flat=True)
            .distinct()
        )

        if len(portfolio.coins) != len(actual_coins):
            portfolio.coins = actual_coins
            portfolio.save(update_fields=["coins"])

    except Exception as e:
        print(f"Error syncing portfolio {portfolio_id}: {e}")
