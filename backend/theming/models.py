# theming/models.py
from django.db import models

class ThemeSetting(models.Model):
    active_theme = models.CharField(max_length=50, default="default")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Theme Setting"
        verbose_name_plural = "Theme Settings"

    def __str__(self):
        return self.active_theme
