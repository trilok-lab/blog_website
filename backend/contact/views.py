from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


@api_view(["POST"])
def submit_contact(request):
    data = request.data or {}
    # In real-world, validate and persist; here we just echo
    return Response({"ok": True, "received": data}, status=status.HTTP_200_OK)

# Create your views here.
