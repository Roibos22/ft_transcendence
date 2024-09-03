from django.urls import path
from .views import *

urlpatterns = [
    path('', get_games, name='get_games'),
    path('create/', create_game, name='create_game')
]
