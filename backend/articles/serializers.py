from rest_framework import serializers
from .models import Article, Category


class CategorySerializer(serializers.ModelSerializer):
    permalink = serializers.ReadOnlyField()

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "permalink"]


class ArticleSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    category_ids = serializers.PrimaryKeyRelatedField(
        many=True, write_only=True, queryset=Category.objects.all(), source="categories"
    )
    permalink = serializers.ReadOnlyField()

    class Meta:
        model = Article
        fields = [
            "id",
            "title",
            "slug",
            "excerpt",
            "body",
            "image",
            "categories",
            "category_ids",
            "approved",
            "is_slider",
            "popularity",
            "permalink",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["approved"]


