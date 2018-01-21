from django.views import View
from decorators import require_auth


class User(View):

    def get(self, request, *args, **kwargs):
        pass

    @require_auth
    def put(self, request, *args, **kwargs):
        pass


class UserProfile(View):

    def get(self, request, *args, **kwargs):
        pass

    @require_auth
    def put(self, request, *args, **kwargs):
        pass


class UserCreate(View):

    @require_auth
    def post(self, request, *args, **kwargs):
        pass
