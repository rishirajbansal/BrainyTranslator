from django.utils import timezone

from django.db import models


class TranslateDetails(models.Model):

    id = models.AutoField(primary_key=True)
    src_language = models.CharField(max_length=200, null=False, blank=False)
    tgt_language = models.CharField(max_length=200, null=False, blank=False)
    total_bytes = models.IntegerField(null=True, blank=True)
    mode = models.CharField(max_length=2, null=True, blank=True)
    amount = models.FloatField(null=True, blank=True)
    process_time = models.FloatField(null=True, blank=True)
    translated_on = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'translate_details'

    def save(self, *args, **kwargs):
        if not self.id:
            # self.translated_on = args[0]
            self.translated_on = timezone.now()
            # self.translated_on = self.translated_on.replace(tzinfo=None)

        return super().save(*args, **kwargs)

