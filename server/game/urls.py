from django.urls import path
from .views import get_games, create_game

urlpatterns = [
    path('', get_games, name='get_games'),
    path('create/', create_game, name='create_game')
]
