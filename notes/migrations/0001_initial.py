# Generated by Django 4.1 on 2023-04-10 22:00

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import notes.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="NoteType",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("category", models.CharField(max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name="QuickNote",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("note_title", models.CharField(max_length=50)),
                ("note_body", models.TextField(max_length=100)),
                ("time_created", models.DateTimeField(auto_now_add=True)),
                ("time_modified", models.DateTimeField(auto_now=True)),
                (
                    "note_author",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="author_%(app_label)s_%(class)s",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "note_category",
                    models.ForeignKey(
                        default=notes.models.NoteType.get_default_category_pk,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="notes.notetype",
                    ),
                ),
            ],
            options={
                "ordering": ["time_modified"],
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="CategorizedNote",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("note_title", models.CharField(max_length=50)),
                ("note_body", models.TextField(max_length=100)),
                ("time_created", models.DateTimeField(auto_now_add=True)),
                ("time_modified", models.DateTimeField(auto_now=True)),
                (
                    "note_author",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="author_%(app_label)s_%(class)s",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "note_category",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="notes.notetype"
                    ),
                ),
            ],
            options={
                "ordering": ["time_modified"],
                "abstract": False,
            },
        ),
    ]
