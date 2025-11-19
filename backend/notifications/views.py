from django.core.mail import send_mail
from django.conf import settings

def notify_admin_new_article(article):
    send_mail(
        subject=f"New Article Submitted: {article.title}",
        message=f"Article '{article.title}' submitted by {article.author.username}",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[settings.CONTACT_EMAIL],
    )

def notify_user_new_comment(comment):
    if comment.article.author.email:
        send_mail(
            subject=f"New Comment on your article {comment.article.title}",
            message=f"{comment.author.username if comment.author else 'Guest'} commented: {comment.text}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[comment.article.author.email],
        )
