from django.urls import path, include
# from oauth2_provider import urls as oauth2_urls
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Urls with no logged in user
    path('', get_users, name='get_users'),
    path('create/', create_user, name='create_user'),
    path('login/', custom_token_obtain_pair, name='login'),
    path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    # Urls for logged in user
    path('login/refresh/', TokenRefreshView.as_view(), name='login_refresh'),
    path('profile/<int:user_id>/', user_profile, name='profile'),
    path('profile/<int:user_id>/delete/', delete_user, name='delete_user'),
	path('profile/<int:user_id>/update/', update_user, name='update_user')
    # path('o/', include(oauth2_urls)),
]
