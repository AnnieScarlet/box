import functools
from django.conf import settings


def require_auth(func):
    @functools.wraps(func)
    def _require_auth(self, request, *args, **kwargs):

        if settings.DEBUG:
            from user.models import User
            try:
                user = User.objects.get(alias='dev_user')
            except User.DoesNotExist:
                user = User.objects.create(alias='dev_user')

            request.user = user

        return func(self, request, *args, **kwargs)
    return _require_auth
