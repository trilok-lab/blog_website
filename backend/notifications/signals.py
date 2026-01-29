from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.conf import settings

from articles.models import Article
from comments.models import Comment
from .models import Notification
from .emails import send_markdown_email


# -------------------------------------------------
# STORE PREVIOUS COMMENT APPROVAL STATE
# -------------------------------------------------
@receiver(pre_save, sender=Comment)
def store_previous_approval(sender, instance, **kwargs):
    """
    Store previous approval state so we can detect
    False → True transitions reliably.
    """
    if instance.pk:
        try:
            old = Comment.objects.get(pk=instance.pk)
            instance._previous_approved = old.approved
        except Comment.DoesNotExist:
            instance._previous_approved = False
    else:
        instance._previous_approved = False


# -------------------------------------------------
# NEW ARTICLE SUBMISSION → ADMIN + AUTHOR
# -------------------------------------------------
@receiver(post_save, sender=Article)
def notify_admin_new_article(sender, instance: Article, created, **kwargs):
    if not created:
        return

    admin_email = (
        getattr(settings, "CONTACT_EMAIL", None)
        or settings.DEFAULT_FROM_EMAIL
    )

    context = {
        "title": instance.title,
        "slug": instance.slug,
        "author": instance.author.username if instance.author else "Guest",
        "created_at": instance.created_at,
        "is_approved": instance.is_approved,
    }

    # 📧 EMAIL → ADMIN
    send_markdown_email(
        subject=f"New Article Submitted: {instance.title}",
        template_name="emails/new_article.md",
        context=context,
        to_email=admin_email,
    )

    # 🔔 IN-APP → AUTHOR
    if instance.author:
        Notification.objects.create(
            user=instance.author,
            title="Article submitted",
            message=(
                f'Your article "{instance.title}" '
                f'has been submitted and is pending approval.'
            ),
            type="article",
        )


# -------------------------------------------------
# COMMENT APPROVED → WRITER + COMMENTER
# -------------------------------------------------
@receiver(post_save, sender=Comment)
def notify_on_comment_approved(sender, instance: Comment, created, **kwargs):
    """
    Fires ONLY when admin approves a comment (False → True).
    Notifies:
    1. Article author (writer)
    2. Comment author (reader)
    """

    previous = getattr(instance, "_previous_approved", False)

    # 🚫 Only trigger on False → True
    if previous is True or not instance.approved:
        return

    article = instance.article
    writer = article.author
    commenter = instance.user

    commenter_name = (
        commenter.username
        if commenter
        else instance.guest_name or "Reader"
    )

    # ------------------------------------
    # Helper: truncate article title
    # ------------------------------------
    def short_title(title: str) -> str:
        if len(title) <= 30:
            return title
        return title[:30] + "......."

    truncated_title = short_title(article.title)

    # -------------------------------------------------
    # 🔔 WRITER NOTIFICATION
    # -------------------------------------------------
    if writer:
        Notification.objects.create(
            user=writer,
            title=f'New comment on "{article.title}"',
            message=(
                f'“{instance.content}”\n\n'
                f'— by {commenter_name}'
            ),
            type="comment",
        )

    # -------------------------------------------------
    # 🔔 COMMENTER NOTIFICATION
    # -------------------------------------------------
    if commenter:
        Notification.objects.create(
            user=commenter,
            title="Comment approved",
            message=(
                f'Your comment "{instance.content}" '
                f'on Article "{truncated_title}" has been approved'
            ),
            type="comment",
        )
