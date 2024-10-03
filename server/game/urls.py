from django.urls import path
from .views import *

urlpatterns = [
    path('', get_games, name='get_games'),
    path('create/', create_game, name='create_game'),
    path('<int:game_id>/', game_profile, name='game_profile'),
    path('create_local/', create_local_game, name='create_local_game'),
]
