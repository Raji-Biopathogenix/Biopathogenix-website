from django.db import migrations, models


def sync_orderitem_dimension_columns(apps, schema_editor):
    OrderItem = apps.get_model("order", "OrderItem")
    table_name = OrderItem._meta.db_table
    connection = schema_editor.connection
    quoted_table_name = schema_editor.quote_name(table_name)
    vendor = connection.vendor

    with connection.cursor() as cursor:
        existing_columns = {
            column.name for column in connection.introspection.get_table_description(cursor, table_name)
        }

    for field_name in ("weight", "length", "width", "height"):
        quoted_field_name = schema_editor.quote_name(field_name)

        if field_name in existing_columns:
            # SQLite does not support MODIFY COLUMN syntax.
            if vendor == "sqlite":
                continue

            if vendor == "mysql":
                schema_editor.execute(
                    f"ALTER TABLE {quoted_table_name} "
                    f"MODIFY COLUMN {quoted_field_name} DECIMAL(10,2) NOT NULL DEFAULT 0.00"
                )
            # For other databases, keep existing column as-is.
            continue

        schema_editor.execute(
            f"ALTER TABLE {quoted_table_name} "
            f"ADD COLUMN {quoted_field_name} DECIMAL(10,2) NOT NULL DEFAULT 0.00"
        )


class Migration(migrations.Migration):

    dependencies = [
        ("order", "0028_alter_order_status_alter_orderstatusupdate_status"),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[
                migrations.RunPython(sync_orderitem_dimension_columns, migrations.RunPython.noop),
            ],
            state_operations=[
                migrations.AddField(
                    model_name="orderitem",
                    name="weight",
                    field=models.DecimalField(blank=True, decimal_places=2, default=0.0, max_digits=10),
                ),
                migrations.AddField(
                    model_name="orderitem",
                    name="length",
                    field=models.DecimalField(blank=True, decimal_places=2, default=0.0, max_digits=10),
                ),
                migrations.AddField(
                    model_name="orderitem",
                    name="width",
                    field=models.DecimalField(blank=True, decimal_places=2, default=0.0, max_digits=10),
                ),
                migrations.AddField(
                    model_name="orderitem",
                    name="height",
                    field=models.DecimalField(blank=True, decimal_places=2, default=0.0, max_digits=10),
                ),
            ],
        ),
    ]
