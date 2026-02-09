# backend/comments/admin.py

from django.contrib import admin
from django.conf import settings

from .models import Comment
from notifications.emails import send_async_email


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("id", "article", "user", "guest_name", "approved", "created_at")
    list_filter = ("approved", "created_at")
    search_fields = ("guest_name", "guest_mobile", "content")

    def save_model(self, request, obj, form, change):
        """
        Handles comment approval notifications.

        Rules:
        1. Admin email is sent when comment is CREATED (handled in API, not here)
        2. Author email is sent ONLY when:
           approved changes from False → True
        """

        # ------------------------------
        # Track previous approval state
        # ------------------------------
        previous_approved = False
        if change:
            try:
                old = Comment.objects.get(pk=obj.pk)
                previous_approved = old.approved
            except Comment.DoesNotExist:
                previous_approved = False

        # ------------------------------
        # Save comment normally
        # ------------------------------
        super().save_model(request, obj, form, change)

        # ------------------------------
        # Send AUTHOR email on approval
        # ------------------------------
        if (not previous_approved) and obj.approved:
            article = obj.article
            author = article.author if article else None

            # Only notify real authors with email
            if author and author.email:
                send_async_email(
                    subject="New comment on your article",
                    to_email=author.email,
                    text_content=(
                        f"Your article '{article.title}' received a new comment.\n\n"
                        f"Comment:\n{obj.content}"
                    ),
                    html_content=None,
                )
