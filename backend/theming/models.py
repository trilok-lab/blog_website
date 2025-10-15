from django.db import models


class ThemeSetting(models.Model):
    active_theme = models.CharField(max_length=50, default="default")
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.active_theme

# Create your models here.
