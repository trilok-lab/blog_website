from django.db import models
from django.utils.text import slugify
from accounts.models import CustomUser

class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Article(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    content = models.TextField()
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="articles")
    categories = models.ManyToManyField(Category, related_name="articles")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    image = models.ImageField(upload_to="articles/", blank=True, null=True)
    is_approved = models.BooleanField(default=False)
    popularity = models.PositiveIntegerField(default=0)
    homepage_slider = models.BooleanField(default=False)
    approved = models.BooleanField(default=False)
    is_slider = models.BooleanField(default=False)


    @property
    def permalink(self):
        return f"/article/{self.slug}"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
