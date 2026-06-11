from django.contrib import admin, messages
from django.core.management import call_command

from .models import KnowledgeBaseEntry, PathogenPanelLookup


@admin.action(description="Run KnowledgeBaseEntry ingestion now")
def run_ingestion(_modeladmin, request, _queryset):
    try:
        call_command("ingest_kb")
    except Exception as exc:
        messages.error(request, f"Ingestion failed: {exc}")
        return
    messages.success(request, "KnowledgeBaseEntry ingestion completed.")


@admin.register(KnowledgeBaseEntry)
class KnowledgeBaseEntryAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "title",
        "doc_type",
        "access",
        "sort_order",
        "is_active",
        "updated_at",
    ]
    list_filter = ["doc_type", "access", "is_active", "updated_at"]
    search_fields = ["title", "content", "doc_type"]
    list_editable = ["sort_order", "is_active"]
    actions = [run_ingestion]


@admin.register(PathogenPanelLookup)
class PathogenPanelLookupAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "pathogen_target",
        "panel_count",
        "is_active",
        "updated_at",
    ]
    list_filter = ["is_active", "updated_at"]
    search_fields = ["pathogen_target", "normalized_name"]
