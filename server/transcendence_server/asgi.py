"""
ASGI config for transcendence_server project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
import django
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from game.consumers.matchmaking import MatchmakingConsumer
from live_games.consumers.local_game_consumer import LocalGameConsumer
from live_games.consumers.Online_game_consumer import OnlineGameConsumer
from .middleware import JWTAuthMiddlewareStack
from django.urls import re_path

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transcendence_server.settings')
django.setup()

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter([
        path('ws/matchmaking/', MatchmakingConsumer.as_asgi()),
        re_path(r'ws/online_game/(?P<game_id>\w+)/$', OnlineGameConsumer.as_asgi()),
        re_path(r'ws/local_game/(?P<game_id>\w+)/$', LocalGameConsumer.as_asgi()),
    ])
})
