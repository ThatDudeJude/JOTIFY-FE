# Generated by Django 4.1 on 2023-06-22 12:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("tasks", "0002_remove_task_is_priority_task_task_priority"),
    ]

    operations = [
        migrations.AlterField(
            model_name="task",
            name="task_priority",
            field=models.CharField(
                choices=[("LOW", "Low"), ("MEDIUM", "Medium"), ("HIGH", "High")],
                default="Low",
                max_length=6,
            ),
        ),
    ]