from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.conf import settings

from articles.models import Article
from comments.models import Comment

from .emails import send_markdown_email
from .models import Notification


# ------------------------------------
# Track previous approval state
# ------------------------------------
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


# ------------------------------------
# NEW ARTICLE SUBMISSION → ADMIN + AUTHOR
# ------------------------------------
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
                f"Your article \"{instance.title}\" "
                f"has been submitted and is pending approval."
            ),
            type="article",
        )


# ------------------------------------
# COMMENT APPROVED → AUTHOR (WRITER ONLY)
# ------------------------------------
@receiver(post_save, sender=Comment)
def notify_author_comment_approved(sender, instance: Comment, created, **kwargs):
    """
    Notify the ARTICLE AUTHOR only when:
    admin approves a comment (False → True)
    """

    previous = getattr(instance, "_previous_approved", False)

    # Trigger ONLY on False → True
    if previous is True or not instance.approved:
        return

    article = instance.article
    author = article.author

    if not author:
        return

    commenter_name = (
        instance.user.username
        if instance.user
        else instance.guest_name or "Reader"
    )

    # 📧 EMAIL → AUTHOR
    if author.email:
        context = {
            "article_title": article.title,
            "comment_content": instance.content,
            "comment_author": commenter_name,
            "created_at": instance.created_at,
        }

        send_markdown_email(
            subject=f"New comment approved on '{article.title}'",
            template_name="emails/comment_approved.md",
            context=context,
            to_email=author.email,
        )

    # 🔔 IN-APP → AUTHOR (STANDARD FORMAT)
    Notification.objects.create(
        user=author,
        title=f"New comment on \"{article.title}\"",
        message=(
            f"“{instance.content}”\n\n"
            f"— by {commenter_name}"
        ),
        type="comment",
    )
