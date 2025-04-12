from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class UserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")

        email = self.normalize_email(email)
        username = email.split("@")[0]

        user = self.model(email=email, username=username, **extra_fields)

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password):
        user = self.create_user(email, password)

        user.is_superuser = True
        user.is_staff = True
        user.role = "admin"
        user.save(using=self._db)

        return user


class User(AbstractBaseUser):
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False, editable=False)
    is_superuser = models.BooleanField(default=False, editable=False)

    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150)
    role = models.CharField(
        choices=[("admin", "Admin"), ("user", "User")],
        default="user",
    )

    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True, null=True, blank=True)

    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.username

    def serialize(self):
        watchlist = getattr(self, "watchlist", None)
        portfolio = getattr(self, "portfolio", None)

        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role,
            "dateJoined": self.date_joined.isoformat(),
            "lastLogin": self.last_login.isoformat(),
            "watchlist_ids": list(watchlist.values_list("id", flat=True))
            if watchlist
            else [],
            "portfolio_ids": list(portfolio.values_list("id", flat=True))
            if portfolio
            else [],
        }
