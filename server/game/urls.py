from django.urls import path
from .views import *

urlpatterns = [
    path('', get_games, name='get_games'),
    path('create/', create_game, name='create_game'),
    path('join/', join_game, name='join_game'),
    path('<int:game_id>/', game_profile, name='game_profile')
]
