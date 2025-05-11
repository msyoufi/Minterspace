from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import (
    UserSerializer,
    UserRegistrationSerializer,
    UpdateEmailSerializer,
    UpdatePasswordSerializer,
)
from .utils import get_tokens_for_user


@api_view(["POST"])
@permission_classes([AllowAny])
def register_view(request):
    serializer = UserRegistrationSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    user = serializer.save()

    response_data = {
        "user": serializer.data,
        "tokens": get_tokens_for_user(user),
    }

    return Response(response_data, status=201)


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def user_view(request):
    user = request.user

    if request.method == "GET":
        serializer = UserSerializer(instance=user)
        return Response(serializer.data, status=200)

    if request.method == "PATCH":
        return update_user(user, request.data)


def update_user(user, data):
    serializer = UserSerializer(user, data=data, partial=True)

    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    serializer.save()

    return Response(serializer.data, status=200)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_email_view(request):
    user = request.user
    serializer = UpdateEmailSerializer(data=request.data, context={"user": user})

    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    user.email = serializer.validated_data["email"]
    user.save(update_fields=["email"])

    return Response(status=204)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_password_view(request):
    user = request.user
    serializer = UpdatePasswordSerializer(data=request.data, context={"user": user})

    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    user.set_password(serializer.validated_data["new_password"])
    user.save(update_fields=["password"])

    return Response(status=204)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def delete_account_view(request):
    user = request.user
    password = request.data.get("password")

    if password is None:
        return Response({"error": "Account password must be provided"}, status=400)

    if not user.check_password(password):
        return Response({"error": "Incorrect password"}, status=401)

    user.delete()

    return Response(status=204)
