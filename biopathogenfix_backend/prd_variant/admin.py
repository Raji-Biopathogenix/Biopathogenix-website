from django.contrib import admin

# Register your models here.
from prd_variant.models import ProductVariantOption,ProductSKUOption,ProductSKU



@admin.register(ProductVariantOption)
class ProductVariantOptionAdmin(admin.ModelAdmin):
    list_display = ['id','product', 'variant_option']


# @admin.register(ProductSKU)
# class ProductSKUAdmin(admin.ModelAdmin):
#     list_display = ['product', 'sku_code']

@admin.register(ProductSKUOption)
class ProductSKUOptionAdmin(admin.ModelAdmin):
    list_display = ['id','sku', 'variant_option']