from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.conf import settings
from django.views import View
from django.http import HttpResponse
from decorators import require_auth

from .models import Entity

import uuid
import ujson


class MediaList(View):

    def get(self, request, *args, **kwargs):
        from boto.s3.connection import S3Connection

        conn = S3Connection(settings.AWS_ACCESS_KEY_ID,settings.AWS_SECRET_ACCESS_KEY)
        bucket = conn.get_bucket(settings.AWS_STORAGE_BUCKET_NAME)

        context = [x.name for x in bucket.list() if x.name.startswith('photo/') and len(x.name) > 6]
        return HttpResponse(ujson.dumps(context))


class MediaDetail(View):

    def get(self, request, *args, **kwargs):
        pass

    @require_auth
    def put(self, request, *args, **kwargs):
        pass

    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super(MediaDetail, self).dispatch(*args, **kwargs)


class MediaCreate(View):

    @require_auth
    def post(self, request, *args, **kwargs):
        file = request.FILES['file']
        title = request.POST['title']
        description = request.POST['description']

        # @TODO: バリデーション
        # @TODO: リサイズ&サムネイル

        context = Entity.create(
                image=file,
                title=title,
                description=description,
            ).to_json()

        return HttpResponse(ujson.dumps(context))

    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super(MediaCreate, self).dispatch(*args, **kwargs)
