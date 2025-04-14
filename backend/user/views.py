from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import UserSerializer, UserRegistrationSerializer
from .utils import get_tokens_for_user


@api_view(["POST"])
@permission_classes([AllowAny])
def register_view(request):
    serializer = UserRegistrationSerializer(data=request.data)

    if not serializer.is_valid():
        print(serializer.errors)
        return Response(serializer.errors, status=400)

    user = serializer.save()

    response_data = {
        "user": serializer.data,
        "tokens": get_tokens_for_user(user),
    }

    return Response(response_data, status=201)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_view(request):
    serializer = UserRegistrationSerializer(instance=request.user)

    return Response(serializer.data, status=200)
