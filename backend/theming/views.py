# theming/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from accounts.permissions import IsAdminUserCustom
from .models import ThemeSetting
from .utils import get_available_themes, load_theme


@api_view(["GET"])
@permission_classes([AllowAny])
def get_theme(request):
    """
    GET /api/theming/setting/
    Returns the active theme + theme JSON data.
    """
    ts, _ = ThemeSetting.objects.get_or_create(pk=1)
    theme_json = load_theme(ts.active_theme)
    return Response({
        "active_theme": ts.active_theme,
        "theme_data": theme_json,
        "available_themes": get_available_themes(),
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsAdminUserCustom])
def set_theme(request):
    """
    POST /api/theming/setting/
    Body: { "active_theme": "dark" }
    Admin-only
    """
    theme_name = request.data.get("active_theme")
    if not theme_name:
        return Response({"error": "active_theme field is required"}, status=400)

    available = get_available_themes()
    if theme_name not in available:
        return Response({"error": f"Invalid theme. Available: {available}"}, status=400)

    ts, _ = ThemeSetting.objects.get_or_create(pk=1)
    ts.active_theme = theme_name
    ts.save(update_fields=["active_theme"])

    return Response({
        "active_theme": theme_name,
        "theme_data": load_theme(theme_name)
    })
