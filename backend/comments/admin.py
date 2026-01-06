# comments/admin.py
from django.contrib import admin
from .models import Comment


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("id", "article", "user", "guest_name", "approved", "created_at")
    list_filter = ("approved", "created_at")
    search_fields = ("guest_name", "guest_mobile", "content")

    def save_model(self, request, obj, form, change):
        """
        Ensure save() is always called so signals fire correctly.
        This is CRITICAL for comment approval notifications.
        """
        if change:
            try:
                old = Comment.objects.get(pk=obj.pk)
                obj._previous_approved = old.approved
            except Comment.DoesNotExist:
                obj._previous_approved = False
        else:
            obj._previous_approved = False

        super().save_model(request, obj, form, change)
