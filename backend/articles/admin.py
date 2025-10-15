from django.contrib import admin
from .models import Article, Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)
    list_display = ("name", "slug")


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("title",)}
    list_display = ("title", "approved", "is_slider", "popularity", "created_at")
    list_filter = ("approved", "is_slider", "created_at", "categories")
    search_fields = ("title", "excerpt", "body")
    autocomplete_fields = ("categories",)

# Register your models here.
