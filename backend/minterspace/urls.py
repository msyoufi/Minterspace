from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/coingecko/", include("coin.urls")),
    path("api/user/", include("user.urls")),
    path("api/portfolio/", include("portfolio.urls")),
]
