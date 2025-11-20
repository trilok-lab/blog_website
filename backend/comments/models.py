from django.db import models
from accounts.models import CustomUser
from articles.models import Article

class Comment(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    guest_name = models.CharField(max_length=255, blank=True, null=True)
    guest_mobile = models.CharField(max_length=20, blank=True, null=True)
    content = models.TextField()
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.user:
            return f"{self.user.username} on {self.article.title}"
        return f"Guest {self.guest_name} on {self.article.title}"
