from django.urls import path, include
# from oauth2_provider import urls as oauth2_urls
from .views import *

urlpatterns = [
    path('', get_users, name='get_users'),
    path('create/', create_user, name='create_user'),
	path('update/<int:user_id>/', update_user, name='update_user'),
    path('delete/<int:user_id>/', delete_user, name='delete_user'),
    path('profile/<int:user_id>/', user_profile, name='profile'),
    path('login/', user_login, name='login'),
    # path('o/', include(oauth2_urls)),
]
