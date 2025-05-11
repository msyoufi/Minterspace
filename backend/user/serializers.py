from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "bio",
            "role",
            "date_joined",
            "last_login",
        )
        read_only_fields = (
            "role",
            "email",
            "password",
            "date_joined",
            "last_login",
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
        read_only_fields = (
            "username",
            "role",
            "date_joined",
            "last_login",
        )

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")

        return value

    def create(self, validated_data):
        return User.objects.create_user(
            email=validated_data["email"], password=validated_data["password"]
        )


class UpdateEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate_password(self, value):
        user = self.context["user"]

        if not user.check_password(value):
            raise serializers.ValidationError("Incorrect password")

        return value

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email address already in use")

        return value


class UpdatePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=True)

    def validate_current_password(self, value):
        user = self.context["user"]

        if not user.check_password(value):
            raise serializers.ValidationError("Incorrect current password")

        return value
