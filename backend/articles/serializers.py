from rest_framework import serializers
from .models import Article, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class ArticleSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    author = serializers.StringRelatedField(read_only=True)
    permalink = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = ['id', 'title', 'slug', 'description', 'author', 'categories', 'image',
                  'popularity', 'homepage_slider', 'approved', 'created_at', 'updated_at', 'permalink']

    def get_permalink(self, obj):
        return obj.get_permalink()
