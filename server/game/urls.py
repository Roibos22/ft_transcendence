from django.urls import path
from .views import get_users, create_user

urlpatterns = [
    path('', get_users, name='get_users'),
    path('create/', create_user, name='create_user')
]
