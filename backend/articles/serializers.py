from rest_framework import serializers
from .models import Article, Category

MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024  # 2 MB

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
    comment_count = serializers.SerializerMethodField(read_only=True)

    # These are create-only helper fields (guests)
    payment_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    verification_session_id = serializers.CharField(write_only=True, required=False, allow_null=True)

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
            "is_approved",
            "is_slider",
            "popularity",
            "permalink",
            "comment_count",
            "payment_id",
            "verification_session_id",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["is_approved", "popularity", "slug", "permalink", "comment_count"]

    def get_comment_count(self, obj):
        # ensure related_name 'comments' exists on Comment model
        return obj.comments.filter(approved=True).count()

    def validate_image(self, image):
        if not image:
            return image
        if image.size > MAX_IMAGE_SIZE_BYTES:
            raise serializers.ValidationError("Image size must be <= 2MB.")
        return image

    def create(self, validated_data):
        validated_data.pop("payment_id", None)
        validated_data.pop("verification_session_id", None)

        categories = validated_data.pop("categories", [])
        article = Article.objects.create(**validated_data)

        if categories:
            article.categories.set(categories)

        return article

    def update(self, instance, validated_data):
        validated_data.pop("payment_id", None)
        validated_data.pop("verification_session_id", None)

        categories = validated_data.pop("categories", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if categories is not None:
            instance.categories.set(categories)
        instance.save()
        return instance
