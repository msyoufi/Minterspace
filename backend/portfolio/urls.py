from django.urls import path
from .views import portfolio_view, portfolio_data_view, transaction_view

urlpatterns = [
    path("", portfolio_view),
    path("<int:portfolio_id>", portfolio_view),
    path("data/<int:portfolio_id>", portfolio_data_view),
    path("transaction/<int:portfolio_id>", transaction_view),
    path("transaction/<int:portfolio_id>/<int:transaction_id>", transaction_view),
]
