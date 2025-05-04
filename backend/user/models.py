from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
import datetime


class UserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        email = self.normalize_email(email)
        username = email.split("@")[0]

        user = self.model(email=email, username=username, **extra_fields)

        user.set_password(password)
        user.last_login = datetime.datetime.now()
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
    username = models.CharField(max_length=15)
    bio = models.CharField(max_length=150, blank=True, default="")
    role = models.CharField(
        choices=[("admin", "Admin"), ("user", "User")],
        default="user",
        max_length=10,
    )

    date_joined = models.DateTimeField(auto_now_add=True, editable=False)
    last_login = models.DateTimeField(blank=True, null=True, editable=False)

    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.username

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser
