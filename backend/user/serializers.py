from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "role",
            "date_joined",
            "last_login",
        )
        read_only_fields = (
            "username",
            "email",
            "role",
        )


class UserRegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "password",
            "email",
            "role",
            "date_joined",
            "last_login",
        )
        read_only_fields = ("username", "role")

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")

        return value

    def create(self, validated_data):
        return User.objects.create_user(
            email=validated_data["email"], password=validated_data["password"]
        )
