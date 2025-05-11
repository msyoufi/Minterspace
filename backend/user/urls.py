from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path("me", views.user_view),
    path("token", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh", TokenRefreshView.as_view(), name="token_refresh"),
    path("me/email", views.update_email_view),
    path("me/password", views.update_password_view),
    path("me/delete", views.delete_account_view),
    path("register", views.register_view),
]
