# Generated by Django 4.0.6 on 2023-02-02 16:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_friendroom_message_delete_messagetest'),
    ]

    operations = [
        migrations.AddField(
            model_name='friendroom',
            name='name',
            field=models.TextField(default='<django.db.models.fields.related.ForeignKey><django.db.models.fields.related.ForeignKey>'),
        ),
    ]