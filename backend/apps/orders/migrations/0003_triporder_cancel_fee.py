from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0002_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='triporder',
            name='cancel_fee',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
    ]
