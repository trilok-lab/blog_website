from django.db import models
from django.conf import settings
from articles.models import Article
from django.utils import timezone


class Comment(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    author_name = models.CharField(max_length=120, blank=True)
    author_mobile = models.CharField(max_length=20, blank=True)
    body = models.TextField()
    approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["created_at"]

    def __str__(self) -> str:
        who = self.user.username if self.user else self.author_name or "Guest"
        return f"Comment by {who} on {self.article.title}"

# Create your models here.
