from django.urls import path, include
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Urls with no logged in user
    path('', get_users, name='get_users'),
    path('create/', create_user, name='create_user'),
    path('login/', user_login, name='login'),
    path('emailverification/<str:username>/', verify_email, name='verify_email'), # on email link press
    # Urls pre-2FA login
    path('2fa/verify/<str:username>/', verify_2fa, name='verify_2fa'),
    path('2fa/confirm/', confirm_2fa, name='confirm_2fa'),
    # Urls for logged in user
    path('2fa/setup/', setup_2fa, name = 'setup_2fa'),
    path('login/refresh/', TokenRefreshView.as_view(), name='login_refresh'),
    path('profile/<str:username>/', user_profile, name='profile'),
    path('profile/<str:username>/avatar/', user_avatar, name='get_avatar'),
    path('profile/<str:username>/delete/', delete_user, name='delete_user'),
	path('profile/<str:username>/update/', update_user, name='update_user')

]
