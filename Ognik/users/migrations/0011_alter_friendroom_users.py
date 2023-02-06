# Generated by Django 4.0.6 on 2023-02-03 13:26

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('users', '0010_remove_friendroom_friend_remove_friendroom_user_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='friendroom',
            name='users',
            field=models.ManyToManyField(related_name='users', to=settings.AUTH_USER_MODEL),
        ),
    ]
