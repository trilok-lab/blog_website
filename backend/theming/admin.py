# theming/admin.py
from django.contrib import admin
from .models import ThemeSetting

@admin.register(ThemeSetting)
class ThemeSettingAdmin(admin.ModelAdmin):
    list_display = ("id", "active_theme", "updated_at")
