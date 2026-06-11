from rest_framework import serializers
from .models import HeaderMenus, CareerOpenRole, CareerApplication,Search,LandingPageType,LandingPageContext,LandingPageImage

from category.serializers import HeaderCategorySerializer



class HeaderMenuHomeSerializer(serializers.ModelSerializer):
    category = HeaderCategorySerializer(read_only=True)
    class Meta:
        model = HeaderMenus
        fields = '__all__'


class SearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Search
        fields = ['name']


class CareerOpenRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerOpenRole
        fields = [
            "id",
            "title",
            "slug",
            "department",
            "location",
            "short_description",
            "description",
            "responsibilities",
            "requirements",
            "salary_range",
            "employment_type",
            "apply_url",
            "sort_order",
        ]


class CareerOpenRoleListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerOpenRole
        fields = [
            "id",
            "title",
            "slug",
            "department",
            "location",
            "short_description",
            "employment_type",
            "apply_url",
            "sort_order",
        ]


class CareerApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerApplication
        fields = [
            "id",
            "role",
            "full_name",
            "email",
            "phone",
            "linkedin_url",
            "message",
            "resume",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def validate_role(self, value):
        if not value.is_active:
            raise serializers.ValidationError("This role is no longer accepting applications.")
        return value

    def validate_resume(self, value):
        max_size = 5 * 1024 * 1024
        if value.size > max_size:
            raise serializers.ValidationError("Resume file size must be 5MB or less.")
        return value



class LandingPageImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = LandingPageImage
        fields = [ "image", "alt_text", "order", "is_active"]


class LandingPageContextSerializer(serializers.ModelSerializer):
    class Meta:
        model = LandingPageContext
        fields = ["title","short_description","description", "btn_text", "btn_url", "download_file"]


class LandingPageTypeSerializer(serializers.ModelSerializer):
    contexts = LandingPageContextSerializer(many=True, read_only=True)
    images = LandingPageImageSerializer(many=True, read_only=True)

    class Meta:
        model = LandingPageType
        fields = [ "name", "order", "is_active", "contexts", "images"]
