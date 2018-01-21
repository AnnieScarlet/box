import uuid
from django.db import models


#  class MediaType:
    #  Photo = 1


class Entity(models.Model):

    def get_image_upload_path(self, filename):
        return 'photo/' + uuid.uuid4().hex

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    #  media_type = models.IntegerField()
    image = models.ImageField(upload_to=get_image_upload_path, default=None)
    title = models.CharField(max_length=255, default=None)
    description = models.CharField(max_length=2048, default=None)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @classmethod
    def create(cls, **kwargs):
        return cls.objects.create(**kwargs)

    def to_json(self):
        return {
            'id': self.id.hex,
            'name': self.image.name,
            'title': self.title,
            'description': self.description,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
        }
