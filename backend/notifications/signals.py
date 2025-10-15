from django.conf import settings
from django.core.mail import send_mail
from django.db.models.signals import post_save
from django.dispatch import receiver
from articles.models import Article
from comments.models import Comment


@receiver(post_save, sender=Article)
def notify_admin_on_article(sender, instance: Article, created, **kwargs):
    if created:
        subject = f"New article submitted: {instance.title}"
        message = f"Title: {instance.title}\nSlug: {instance.slug}\nApproved: {instance.approved}"
        send_mail(subject, message, settings.EMAIL_HOST_USER, [settings.EMAIL_HOST_USER], fail_silently=True)


@receiver(post_save, sender=Comment)
def notify_author_on_comment(sender, instance: Comment, created, **kwargs):
    if created and instance.article.author and instance.article.author.email:
        subject = f"New comment on: {instance.article.title}"
        message = instance.body
        send_mail(subject, message, settings.EMAIL_HOST_USER, [instance.article.author.email], fail_silently=True)

