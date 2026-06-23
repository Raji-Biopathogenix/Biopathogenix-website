from django.db import migrations


def add_missing_is_displayed(apps, schema_editor):
    connection = schema_editor.connection
    table_name = "users_userTypes"
    quoted_table_name = schema_editor.quote_name(table_name)
    quoted_column_name = schema_editor.quote_name("is_displayed")

    with connection.cursor() as cursor:
        table_names = set(connection.introspection.table_names(cursor))
        if table_name not in table_names:
            return

        columns = {
            column.name
            for column in connection.introspection.get_table_description(cursor, table_name)
        }

    if "is_displayed" in columns:
        return

    # Add the missing column using SQL so this migration works even when
    # migration state from a parallel branch has already removed the field.
    schema_editor.execute(
        f"ALTER TABLE {quoted_table_name} "
        f"ADD COLUMN {quoted_column_name} bool NOT NULL DEFAULT 1"
    )


class Migration(migrations.Migration):
    atomic = False

    dependencies = [
        ("users", "0022_customuser_laboratory"),
    ]

    operations = [
        migrations.RunPython(
            add_missing_is_displayed,
            reverse_code=migrations.RunPython.noop,
        ),
    ]
