# comments/models.py
from django.db import models
from django.conf import settings
from django.utils import timezone
from articles.models import Article

class Comment(models.Model):
    article = models.ForeignKey(
        Article,
        on_delete=models.CASCADE,
        related_name="comments"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    guest_name = models.CharField(max_length=120, blank=True, null=True)
    guest_mobile = models.CharField(max_length=20, blank=True, null=True)

    content = models.TextField()

    approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        if self.user:
            return f"{self.user.username} on {self.article.title}"
        return f"Guest {self.guest_name or 'Anonymous'} on {self.article.title}"
