from django.contrib import admin
from django.db.utils import OperationalError, ProgrammingError

# Register your models here.

from .models import QBConfig, TaxConfig, UPSConfig

@admin.register(QBConfig)
class QBConfigAdmin(admin.ModelAdmin):
    list_display  = ["environment", "realm_id", "updated_at"]
    readonly_fields = ["updated_at", "created_at"]

    def has_add_permission(self, request):
        # Only allow ONE row
        try:
            return not QBConfig.objects.exists()
        except (ProgrammingError, OperationalError):
            # Table may not exist before migrations.
            return True

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(TaxConfig)
class TaxConfigAdmin(admin.ModelAdmin):
    list_display = ["provider", "enabled", "use_sandbox", "nexus_state", "nexus_zip", "updated_at"]
    readonly_fields = ["updated_at", "created_at"]
    fieldsets = (
        ("Provider", {"fields": ("enabled", "provider", "api_key", "use_sandbox")}),
        ("Nexus Address", {"fields": ("nexus_country", "nexus_zip", "nexus_state", "nexus_city", "nexus_street")}),
        ("Audit", {"fields": ("updated_at", "created_at")}),
    )

    def has_add_permission(self, request):
        try:
            return not TaxConfig.objects.exists()
        except (ProgrammingError, OperationalError):
            # Table may not exist before migrations.
            return True

    def has_delete_permission(self, request, obj=None):
        return False
    
admin.site.register(UPSConfig)

