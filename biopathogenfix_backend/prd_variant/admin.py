from django.contrib import admin
from prd_variant.models import ProductVariantOption, ProductSKUOption, ProductSKU


@admin.register(ProductVariantOption)
class ProductVariantOptionAdmin(admin.ModelAdmin):
    list_display = ['id', 'product', 'variant_option']


class ProductSKUOptionInline(admin.TabularInline):
    model = ProductSKUOption
    extra = 0
    readonly_fields = ['variant_option']
    can_delete = False


@admin.register(ProductSKU)
class ProductSKUAdmin(admin.ModelAdmin):
    inlines = [ProductSKUOptionInline]
    list_display = ['product', 'sku_code', 'price', 'stock', 'is_active']
    list_filter = ['product', 'is_active']
    search_fields = ['sku_code', 'product__name']
    fields = ['product', 'sku_code', 'price', 'stock', 'low_stock_threshold', 'is_active',
              'weight', 'length', 'width', 'height']
    readonly_fields = ['product']


@admin.register(ProductSKUOption)
class ProductSKUOptionAdmin(admin.ModelAdmin):
    list_display = ['id', 'sku', 'variant_option']