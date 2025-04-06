from rest_framework.response import Response
from django.conf import settings
import httpx

BASE_URL = "https://api.coingecko.com/api/v3/"

HEADERS = {
    "accept": "application/json",
    "x-cg-demo-api-key": settings.COINGECKO_API_KEY,
}


def get(url_suffix, params):
    url = BASE_URL + url_suffix

    try:
        data = httpx.get(url, headers=HEADERS, params=params).raise_for_status().json()
        return Response(data)

    except httpx.RequestError as exc:
        return Response({"error": f"Error while requesting {str(exc.request.url)}"})

    except httpx.HTTPStatusError as exc:
        return Response({"error": str(exc)}, status=exc.response.status_code)

    except Exception as exc:
        return Response({"error": f"Unexpected error: {str(exc)}"}, status=500)
