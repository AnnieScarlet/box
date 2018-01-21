from django.urls import path, include

from . import views


urlpatterns = [
    path('create', views.MediaCreate.as_view()),
    path('list', views.MediaList.as_view()),
    path('detail', views.MediaDetail.as_view()),
]
