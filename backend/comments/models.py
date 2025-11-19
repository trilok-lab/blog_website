from django.db import models
from django.contrib.auth import get_user_model
from articles.models import Article
from django.utils import timezone

User = get_user_model()

class Comment(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    text = models.TextField()
    approved = models.BooleanField(default=False)
    guest_mobile_no = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment on {self.article.title} by {self.user or self.guest_mobile_no}"
