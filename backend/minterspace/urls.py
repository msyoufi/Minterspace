from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path("admin/", admin.site.urls),
    path("coingecko/", include("coin.urls")),
    path("user/", include("user.urls")),
    path("portfolio/", include("portfolio.urls")),
]
