from rest_framework import serializers
from .models import Article, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]

class ArticleSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)
    categories = CategorySerializer(many=True, read_only=True)
    category_ids = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), many=True, write_only=True, source='categories'
    )
#    permalink = serializers.CharField(source='permalink', read_only=True)

    class Meta:
        model = Article
        fields = [
            "id", "title", "slug", "permalink", "content", "author",
            "categories", "category_ids", "image", "is_approved",
            "popularity", "homepage_slider", "created_at", "updated_at"
        ]

    def create(self, validated_data):
        categories = validated_data.pop("categories", [])
        article = Article.objects.create(**validated_data)
        article.categories.set(categories)
        return article

    def update(self, instance, validated_data):
        categories = validated_data.pop("categories", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if categories is not None:
            instance.categories.set(categories)
        instance.save()
        return instance
