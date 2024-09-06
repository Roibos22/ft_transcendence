from django.urls import path, include
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Urls with no logged in user
    path('', get_users, name='get_users'),
    path('create/', create_user, name='create_user'),
    path('login/', user_login, name='login'),
    # Urls pre-2FA login
    path('2fa/verify/', verify_2fa, name='verify_2fa'),
    path('login/2fa/', confirm_2fa, name='confirm_2fa'),
    # Urls for logged in user
    path('2fa/setup/', setup_2fa, name = 'setup_2fa'),
    path('login/refresh/', TokenRefreshView.as_view(), name='login_refresh'),
    path('profile/<int:user_id>/', user_profile, name='profile'),
    path('profile/<int:user_id>/delete/', delete_user, name='delete_user'),
	path('profile/<int:user_id>/update/', update_user, name='update_user')

    # path('o/', include(oauth2_urls)),
]
