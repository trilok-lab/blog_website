from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ThemeSetting


@api_view(["GET", "POST"])
def theme_setting(request):
    if request.method == "GET":
        ts, _ = ThemeSetting.objects.get_or_create(pk=1)
        return Response({"active_theme": ts.active_theme})
    ts, _ = ThemeSetting.objects.get_or_create(pk=1)
    ts.active_theme = request.data.get("active_theme", ts.active_theme)
    ts.save(update_fields=["active_theme"])
    return Response({"active_theme": ts.active_theme})

# Create your views here.
