

import json
from itertools import product as itertools_product

from django import forms
from django.contrib import admin
from django.db import transaction
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from django.core.cache import cache


from django.contrib import admin
from .models import Product, ProductImage, ProductDocument, ProductFaQ, Pathogen, ProductPathogen, ProductAssayDetail, ProductRelatedInfo, AssayPanelTargetDocument
from prd_variant.models import ProductSKU,ProductVariantOption,ProductSKUOption
from variant.models import Variant,VariantOption

import json
from django.contrib import admin
from django.db import transaction
from django.utils.safestring import mark_safe
from django.contrib.contenttypes.admin import GenericTabularInline
from comment.models import Comment
from django.utils import timezone
from django.contrib.contenttypes.models import ContentType

from comment.mixins import CommentInline, CommentMixin

class CommentInline(GenericTabularInline):
    model = Comment
    extra = 1
    max_num = 1          
    can_delete = False   
    min_num = 1          
    validate_min = True  
    fields = ['description']
    readonly_fields = ['created_at']

    def get_queryset(self, request):
        return Comment.objects.none()


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['image', 'alt_text', 'is_primary','hover', 'sort_order']


class ProductFaqInline(admin.TabularInline):
    model = ProductFaQ
    extra = 1
    fields = ['question', 'answer', 'sort_order','is_active']


class ProductSKUInline(admin.TabularInline):
    model = ProductSKU
    extra = 0
    fields = ['sku_code', 'price', 'stock','low_stock_threshold','weight', 'length', 'width', 'height', 'is_active']
    readonly_fields = ['sku_code']
    can_delete = True

    def has_add_permission(self, request, obj=None):
        return False


class ProductDocumentInline(admin.TabularInline):
    model = ProductDocument
    extra = 0
    fields = ['section', 'title', 'file', 'sku', 'target_search_text', 'sort_order', 'is_active']
    autocomplete_fields = ['sku']

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'sku':
            object_id = request.resolver_match.kwargs.get('object_id') if request.resolver_match else None
            if object_id:
                kwargs['queryset'] = ProductSKU.objects.filter(product_id=object_id).order_by('sku_code')
            else:
                kwargs['queryset'] = ProductSKU.objects.none()
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


class ProductPathogenInline(admin.TabularInline):
    model = ProductPathogen
    extra = 3
    autocomplete_fields = ['pathogen']
    fields = ['pathogen', 'sort_order']


class ProductAssayDetailInline(admin.StackedInline):
    model = ProductAssayDetail
    extra = 0
    max_num = 1
    fields = ['assay_type', 'reaction_format', 'panel_name', 'catalog_number', 'target_count', 'is_active']


class ProductRelatedInfoInline(admin.TabularInline):
    model = ProductRelatedInfo
    extra = 3
    fields = ['title', 'content', 'sort_order', 'is_active']


@admin.register(Product)
class ProductAdmin(CommentMixin,admin.ModelAdmin):

    list_display        = ['name', 'sku', 'get_categories', 'price', 'stock_quantity', 'is_active','is_customizable', 'is_featured', 'created_at']
    list_filter         = ['is_active', 'is_featured', 'categories', 'created_at']
    search_fields       = ['name', 'sku', 'description']
    prepopulated_fields = {'slug': ('name',)}
    filter_horizontal   = ('categories',)
    inlines             = [ProductImageInline, ProductSKUInline, ProductDocumentInline, ProductFaqInline, ProductAssayDetailInline, ProductRelatedInfoInline, CommentInline]
    change_form_template = 'admin/product/product/change_form.html'

    readonly_fields = [
        'variant_selector',
        'created_by', 'updated_by', 'created_at', 'updated_at', 'views_count'
    ]



    # Edit page — price/stock hidden (managed via SKUs)
    fieldsets = (
        ('Basic Info', {'fields': ('name', 'slug', 'sku','trademark')}),
        ('Categories', {'fields': ('categories',)}),
        ('Description', {'fields': ('short_description', 'description')}),
        ('Pricing', {'fields': ('compare_price', 'cost_price')}),
        # ('Inventory', {'fields': ('low_stock_threshold',)}),
        ('Variants & SKU Generator', {
            'fields': ('has_variants','variant_selector',),
            'description': 'Select variant options to auto-generate SKU combinations.'
        }),
        # ('Dimensions', {'fields': ('weight', 'length', 'width', 'height'), 'classes': ('collapse',)}),
        ('SEO', {'fields': ('meta_title', 'meta_description'), 'classes': ('collapse',)}),
        ('Status', {'fields': ('is_active', 'is_featured', 'is_customizable', 'is_shipping_required', 'is_returnable')}),
        ('Metadata', {
            'fields': ('views_count', 'created_by', 'updated_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    # Create page — price/stock visible
    add_fieldsets = (
        ('Basic Info', {'fields': ('name', 'slug', 'sku','trademark')}),
        ('Categories', {'fields': ('categories',)}),
        ('Description', {'fields': ('short_description', 'description')}),
        ('Pricing', {'fields': ('price', 'compare_price', 'cost_price')}),
        ('Inventory', {'fields': ('stock_quantity', 'low_stock_threshold')}),
        ('Variants & SKU Generator', {
            'fields': ('has_variants','variant_selector',),
            'description': 'Select variant options to auto-generate SKU combinations.'
        }),
        ('Dimensions', {'fields': ('weight', 'length', 'width', 'height'), 'classes': ('collapse',)}),
        ('SEO', {'fields': ('meta_title', 'meta_description'), 'classes': ('collapse',)}),
        ('Status', {'fields': ('is_active', 'is_featured', 'is_customizable', 'is_shipping_required', 'is_returnable')}),
        ('Metadata', {
            'fields': ('created_by', 'updated_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    
    def variant_selector(self, obj):
        selected_ids = []
        if obj and obj.pk:
            selected_ids = list(
                ProductVariantOption.objects
                .filter(product=obj)
                .values_list('variant_option_id', flat=True)
            )
        selected_str = ','.join(str(i) for i in selected_ids)

        return mark_safe(f"""
        <div id="variant-sku-section" style="width:100%;">
            <input type="hidden" name="selected_variant_options"
                   id="selected_variant_options" value="{selected_str}">
            <input type="hidden" name="sku_combinations"
                   id="sku_combinations" value="">
            <div id="variant-checkboxes">
                <p style="color:#999; font-size:13px;">
                    Please select a category above to load variants.
                </p>
            </div>
            <div id="sku-preview-section" style="margin-top:20px; display:none;">
                <h3 style="font-size:14px; margin-bottom:8px; color:#333;"> SKU Combinations</h3>
                <table style="width:100%; border-collapse:collapse; font-size:13px;">
                    <thead>
                        <tr style="background:#f0f0f0;">
                            <th style="padding:8px; border:1px solid #ddd; text-align:left;">SKU Code</th>
                            <th style="padding:8px; border:1px solid #ddd; text-align:left;">Price</th>
                            <th style="padding:8px; border:1px solid #ddd; text-align:left;">Stock</th>
                            <th style="padding:8px; border:1px solid #ddd; text-align:left;">Low Stock Threshold</th>
                            <th style="padding:8px; border:1px solid #ddd; text-align:left;">Weight</th>
                            <th style="padding:8px; border:1px solid #ddd; text-align:left;">Length</th>
                            <th style="padding:8px; border:1px solid #ddd; text-align:left;">Width</th>
                            <th style="padding:8px; border:1px solid #ddd; text-align:left;">Height</th>
                        </tr>
                    </thead>
                    <tbody id="sku-preview-body"></tbody>
                </table>
            </div>
        </div>
        """)

    variant_selector.short_description = 'Variant Options'

    # add_view: no product yet → pass ALL variants grouped by
    # category so JS can filter client-side when user picks a category
    def add_view(self, request, form_url='', extra_context=None):
        extra_context = extra_context or {}
        extra_context['all_variants_json'] = self._get_all_variants_json()
        extra_context['variants_json']     = '[]'   # none selected yet
        extra_context['selected_json']     = '[]'
        return super().add_view(request, form_url, extra_context)

    # 
    # change_view: product exists → filter by its categories
    def change_view(self, request, object_id, form_url='', extra_context=None):
        extra_context = extra_context or {}
        extra_context['all_variants_json'] = self._get_all_variants_json()

        # Get product's current categories
        category_ids = list(
            Product.objects.filter(pk=object_id)
            .values_list('categories__id', flat=True)
        )
        extra_context['variants_json'] = self._get_variants_json_by_categories(category_ids)

        selected_ids = list(
            ProductVariantOption.objects
            .filter(product_id=object_id)
            .values_list('variant_option_id', flat=True)
        )
        extra_context['selected_json'] = json.dumps(selected_ids)
        return super().change_view(request, object_id, form_url, extra_context)

    # All variants grouped by category_id → for JS filtering
    def _get_all_variants_json(self):
        grouped = {}
        for variant in Variant.objects.prefetch_related('options').order_by('order'):
            options = [{'id': opt.id, 'value': opt.value} for opt in variant.options.all()]
            if not options:
                continue
            # key: category id or "null" for global variants
            key = str(variant.category_id) if variant.category_id else 'null'
            if key not in grouped:
                grouped[key] = []
            grouped[key].append({
                'id': variant.id,
                'name': variant.name,
                'options': options
            })
        return json.dumps(grouped)

    # Variants filtered by given category ids (for change_view preload)
    def _get_variants_json_by_categories(self, category_ids):
        variants_data = []
        qs = Variant.objects.prefetch_related('options').order_by('order')
        if category_ids:
            qs = qs.filter(category_id__in=category_ids)
        else:
            qs = qs.none()
        for variant in qs:
            options = [{'id': opt.id, 'value': opt.value} for opt in variant.options.all()]
            if options:
                variants_data.append({
                    'id': variant.id,
                    'name': variant.name,
                    'options': options
                })
        return json.dumps(variants_data)
    

    def get_fieldsets(self, request, obj=None):
        if obj is None:
            return self.add_fieldsets
        return self.fieldsets

    def get_form(self, request, obj=None, **kwargs):
        exclude = list(kwargs.get('exclude') or [])

        if obj is not None:
            exclude += ['price', 'stock_quantity','low_stock_threshold','weight', 'length', 'width', 'height']

        for f in (self.readonly_fields or []):
            if f not in exclude:
                exclude.append(f)

        kwargs['exclude'] = exclude
        return super().get_form(request, obj, **kwargs)
    


    class Media:
        js = ('admin/js/variant_sku_generator.js',)

    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        obj.updated_by = request.user
        super().save_model(request, obj, form, change)
        cache.delete(f"product_detail:{obj.slug}")
        #  wipe all variant data for a product 

    def delete_model(self, request, obj):
        cache.delete(f"product_detail:{obj.slug}")   
        super().delete_model(request, obj)
    
    def _delete_all_variant_data(self, obj):
        sku_ids = list(
            ProductSKU.objects.filter(product=obj).values_list('id', flat=True)
        )
        if sku_ids:
            ProductSKUOption.objects.filter(sku_id__in=sku_ids).delete()
            ProductSKU.objects.filter(id__in=sku_ids).delete()
        ProductVariantOption.objects.filter(product=obj).delete()

     # Wipe all variant data 
    def _delete_all_variant_data(self, obj):
        sku_ids = list(ProductSKU.objects.filter(product=obj).values_list('id', flat=True))
        if sku_ids:
            ProductSKUOption.objects.filter(sku_id__in=sku_ids).delete()
            ProductSKU.objects.filter(id__in=sku_ids).delete()
        ProductVariantOption.objects.filter(product=obj).delete()

    @transaction.atomic
    def save_related(self, request, form, formsets, change):
        # Capture old categories BEFORE super() saves new ones
        old_category_ids = set()
        if change and form.instance.pk:
            old_category_ids = set(
                form.instance.categories.values_list('id', flat=True)
            )
        
        old_has_variant = form.instance.has_variants

        super().save_related(request, form, formsets, change)
        obj = form.instance

        # Category changed → delete everything and stop 
        # JS resets the variant UI on category change and continute to create variants
        # Category changed → smart delete by removed categories 
        new_category_ids = set(obj.categories.values_list('id', flat=True))
        if old_category_ids != new_category_ids:
            removed_category_ids = old_category_ids - new_category_ids

            if removed_category_ids:
                # Find variant_option_ids that belong to removed categories
                removed_variant_option_ids = list(
                    VariantOption.objects.filter(
                        variant__category_id__in=list(removed_category_ids)
                    ).values_list('id', flat=True)
                )

                if removed_variant_option_ids:
                    # Delete SKUs that contain any of these options
                    sku_ids_to_delete = list(
                        ProductSKU.objects.filter(
                            product=obj,
                            sku_options__variant_option_id__in=removed_variant_option_ids
                        ).distinct().values_list('id', flat=True)
                    )
                    if sku_ids_to_delete:
                        ProductSKUOption.objects.filter(sku_id__in=sku_ids_to_delete).delete()
                        ProductSKU.objects.filter(id__in=sku_ids_to_delete).delete()

                    # Delete ProductVariantOptions for removed options
                    ProductVariantOption.objects.filter(
                        product=obj,
                        variant_option_id__in=removed_variant_option_ids
                    ).delete()

        #  No variant input submitted → nothing to do 
        if 'selected_variant_options' not in request.POST:
            return

        selected_ids_raw     = request.POST.get('selected_variant_options', '')
        sku_combinations_raw = request.POST.get('sku_combinations', '')

        new_selected_ids = set(
            int(i) for i in selected_ids_raw.split(',') if i.strip().isdigit()
        )

        print("obj.has_variant====> ",obj.has_variants)

        # No variants selected → create single default SKU from product 
        if not new_selected_ids or not obj.has_variants:
            print("obj.has_variant====> Entered")

            # Delete any variant-based SKUs first
            self._delete_all_variant_data(obj)
            # Create default SKU only if none exists
            if not ProductSKU.objects.filter(product=obj).exists():
                ProductSKU.objects.create(
                    product  = obj,
                    sku_code = obj.sku,
                    price    = obj.price,
                    stock    = obj.stock_quantity,
                    low_stock_threshold = obj.low_stock_threshold,
                    is_active= obj.is_active,
                )
            return
        
        if obj.has_variants:
            sku_option_len = ProductSKUOption.objects.filter(sku__product__id=obj.id).count()
            print("sku_option_len",sku_option_len,"obj.has_variants",obj.has_variants)
            if sku_option_len == 0:
                ProductSKU.objects.filter(product__id=obj.id).delete()



        #  Sync ProductVariantOptions (add new, remove deselected) 
        existing_option_ids = set(
            ProductVariantOption.objects
            .filter(product=obj)
            .values_list('variant_option_id', flat=True)
        )

        to_add    = new_selected_ids - existing_option_ids   # new selections
        to_remove = existing_option_ids - new_selected_ids   # deselected

        # Delete removed variant options + their SKUs
        if to_remove:
            sku_ids_to_delete = list(
                ProductSKU.objects.filter(
                    product=obj,
                    sku_options__variant_option_id__in=list(to_remove)
                ).distinct().values_list('id', flat=True)
            )
            if sku_ids_to_delete:
                ProductSKUOption.objects.filter(sku_id__in=sku_ids_to_delete).delete()
                ProductSKU.objects.filter(id__in=sku_ids_to_delete).delete()
            ProductVariantOption.objects.filter(
                product=obj, variant_option_id__in=list(to_remove)
            ).delete()

        # Add new variant options
        if to_add:
            ProductVariantOption.objects.bulk_create([
                ProductVariantOption(product=obj, variant_option_id=vid)
                for vid in to_add
            ])

        # Sync SKUs (add new combinations, keep existing) 
        try:
            combinations = json.loads(sku_combinations_raw) if sku_combinations_raw else []
        except (json.JSONDecodeError, ValueError):
            combinations = []

        existing_sku_codes = set(
            ProductSKU.objects.filter(product=obj).values_list('sku_code', flat=True)
        )

        for combo in combinations:
            sku_code   = combo.get('sku_code', '')
            option_ids = combo.get('option_ids', [])
            if not sku_code:
                continue
            if sku_code in existing_sku_codes:
                # Already exists → skip (preserve existing price/stock)
                continue
            # New combination → create
            sku = ProductSKU.objects.create(
                product  = obj,
                sku_code = sku_code,
                price    = combo.get('price', 0.00),
                stock    = combo.get('stock', 0),
                low_stock_threshold = combo.get('low_stock', 0),
                weight = combo.get('weight', 0),
                length = combo.get('length', 0),
                width  = combo.get('width', 0),
                height = combo.get('height', 0),
            )
            for opt_id in option_ids:
                ProductSKUOption.objects.create(sku=sku, variant_option_id=opt_id)

   

    @admin.display(description='Categories')
    def get_categories(self, obj):
        return ', '.join(obj.categories.values_list('name', flat=True)) or '—'

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related('categories')


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display  = ['product', 'image', 'is_primary', 'sort_order', 'created_at']
    list_filter   = ['is_primary', 'created_at']
    search_fields = ['product__name', 'alt_text']


@admin.register(ProductSKU)
class ProductSKUAdmin(admin.ModelAdmin):
    list_display    = ['id','product', 'sku_code', 'price', 'stock','low_stock_threshold', 'is_active', 'created_at']
    list_filter     = ['is_active', 'created_at']
    search_fields   = ['sku_code', 'product__name']
    list_editable   = ['price', 'stock','low_stock_threshold', 'is_active']
    readonly_fields = ['sku_code', 'created_at']

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('product')


@admin.register(ProductDocument)
class ProductDocumentAdmin(admin.ModelAdmin):
    list_display = ['id', 'product', 'title', 'section', 'sku', 'sort_order', 'is_active', 'updated_at']
    list_filter = ['section', 'is_active', 'updated_at']
    search_fields = ['title', 'product__name', 'product__sku', 'sku__sku_code', 'target_search_text', 'extracted_target_text']
    autocomplete_fields = ['product', 'sku']
    readonly_fields = ['extracted_target_text']


@admin.register(Pathogen)
class PathogenAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'scientific_name', 'pathogen_type', 'is_active', 'created_at']
    list_filter = ['pathogen_type', 'is_active']
    search_fields = ['name', 'scientific_name']
    list_editable = ['pathogen_type', 'is_active']
    ordering = ['pathogen_type', 'name']

    def get_model_perms(self, request):
        return {}


@admin.register(ProductPathogen)
class ProductPathogenAdmin(admin.ModelAdmin):
    list_display = ['id', 'product', 'pathogen', 'sort_order']
    list_filter = ['pathogen__pathogen_type']
    search_fields = ['product__name', 'pathogen__name']
    autocomplete_fields = ['product', 'pathogen']

    def get_model_perms(self, request):
        return {}


@admin.register(ProductAssayDetail)
class ProductAssayDetailAdmin(admin.ModelAdmin):
    list_display = ['id', 'product', 'assay_type', 'catalog_number', 'reaction_format', 'target_count', 'is_active']
    list_filter = ['assay_type', 'is_active']
    search_fields = ['product__name', 'panel_name', 'catalog_number']
    autocomplete_fields = ['product']

    def get_model_perms(self, request):
        return {}


@admin.register(AssayPanelTargetDocument)
class AssayPanelTargetDocumentAdmin(admin.ModelAdmin):
    list_display = ['id', 'panel_type', 'document_type', 'title', 'target_count', 'view_file', 'sort_order', 'is_active', 'updated_at']
    list_filter = ['panel_type', 'document_type', 'is_active', 'updated_at']
    search_fields = ['title']
    list_editable = ['target_count', 'sort_order', 'is_active']

    @admin.display(description='View')
    def view_file(self, obj):
        if not obj.file:
            return ''
        return format_html('<a href="{}" target="_blank" rel="noopener noreferrer">View file</a>', obj.file.url)
