# notifications/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings

from articles.models import Article
from comments.models import Comment

from .emails import send_markdown_email


# ---------------------------
# 1. NEW ARTICLE SUBMISSION → EMAIL ADMIN
# ---------------------------
@receiver(post_save, sender=Article)
def notify_admin_new_article(sender, instance: Article, created, **kwargs):
    if created:
        admin_email = getattr(settings, "CONTACT_EMAIL", None) or settings.DEFAULT_FROM_EMAIL
        context = {
            "title": instance.title,
            "slug": instance.slug,
            "author": instance.author.username if instance.author else "Guest",
            "created_at": instance.created_at,
            "is_approved": instance.is_approved,
        }
        send_markdown_email(
            subject=f"New Article Submitted: {instance.title}",
            template_name="emails/new_article.md",
            context=context,
            to_email=admin_email
        )


# ---------------------------
# 2. COMMENT APPROVED → EMAIL AUTHOR
# ---------------------------
@receiver(post_save, sender=Comment)
def notify_author_comment_approved(sender, instance: Comment, created, **kwargs):
    """
    Only send email when comment status changes to approved.
    """
    if not created:
        if instance.approved and instance.article.author and instance.article.author.email:
            author_email = instance.article.author.email
            context = {
                "article_title": instance.article.title,
                "comment_content": instance.content,
                "comment_author": instance.user.username if instance.user else instance.guest_name,
                "created_at": instance.created_at,
            }
            send_markdown_email(
                subject=f"Your article '{instance.article.title}' received a new approved comment",
                template_name="emails/comment_approved.md",
                context=context,
                to_email=author_email,
            )
