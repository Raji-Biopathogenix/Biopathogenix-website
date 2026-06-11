from django.db import migrations, models


def sync_orderitem_dimension_columns(apps, schema_editor):
    OrderItem = apps.get_model("order", "OrderItem")
    table_name = OrderItem._meta.db_table
    connection = schema_editor.connection

    with connection.cursor() as cursor:
        existing_columns = {
            column.name for column in connection.introspection.get_table_description(cursor, table_name)
        }

    for field_name in ("weight", "length", "width", "height"):
        if field_name in existing_columns:
            schema_editor.execute(
                f"ALTER TABLE `{table_name}` "
                f"MODIFY COLUMN `{field_name}` DECIMAL(10,2) NOT NULL DEFAULT 0.00"
            )
        else:
            schema_editor.execute(
                f"ALTER TABLE `{table_name}` "
                f"ADD COLUMN `{field_name}` DECIMAL(10,2) NOT NULL DEFAULT 0.00"
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
