# Generated by Django 4.0.6 on 2023-06-29 13:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0014_message_file_message_isincludefile_alter_file_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='file',
            name='fileName',
            field=models.TextField(default='noname', max_length=300),
        ),
        migrations.AlterField(
            model_name='file',
            name='file',
            field=models.FileField(upload_to='fileSystem/'),
        ),
    ]
