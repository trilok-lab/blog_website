# articles/models.py
from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.core.exceptions import ValidationError
from django.db.models import F

class Category(models.Model):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True, blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name

    @property
    def permalink(self) -> str:
        return f"/category/{self.slug}"

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.name)
            slug = base
            idx = 1
            # avoid collisions (exclude self.pk for updates)
            while Category.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                idx += 1
                slug = f"{base}-{idx}"
            self.slug = slug
        super().save(*args, **kwargs)

    def delete(self, using=None, keep_parents=False):
        if self.articles.exists():
            raise ValidationError("Cannot delete category with related articles.")
        return super().delete(using=using, keep_parents=keep_parents)


class Article(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="articles"
    )
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    excerpt = models.CharField(max_length=280, blank=True)
    body = models.TextField()
    image = models.ImageField(upload_to="articles/", blank=True, null=True)
    categories = models.ManyToManyField(Category, blank=True, related_name="articles")
    is_approved = models.BooleanField(default=False)
    is_slider = models.BooleanField(default=False)
    popularity = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.title

    @property
    def permalink(self) -> str:
        return f"/article/{self.slug}"

    def save(self, *args, **kwargs):
        # generate unique slug if missing
        if not self.slug:
            base = slugify(self.title)[:200]
            slug = base
            idx = 1
            while Article.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                idx += 1
                slug = f"{base}-{idx}"
            self.slug = slug

        # guest submissions: author==None => keep unapproved
        if self.author is None:
            self.is_approved = False

        super().save(*args, **kwargs)
