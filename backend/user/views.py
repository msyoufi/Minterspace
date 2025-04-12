from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes


# TODO
@api_view(["POST"])
def register(request):
    if request.method == "POST":
        pass

    return Response(status=405)


# TODO
@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def user(request):
    if request.method == "GET":
        return get_current_user()

    if request.method == "PUT":
        return update_user()

    if request.method == "DELETE":
        return delete_user()

    return Response(status=405)


def get_current_user():
    pass


def update_user():
    pass


def delete_user():
    pass
