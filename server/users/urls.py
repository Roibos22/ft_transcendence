from django.urls import path
from .views import *

urlpatterns = [
    path('', get_users, name='get_users'),
    path('create/', create_user, name='create_user'),
	path('update/', update_user, name='update_user'),
    path('delete/', delete_user, name='delete_user')
]
