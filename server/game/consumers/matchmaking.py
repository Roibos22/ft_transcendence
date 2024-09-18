import random
import string
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async
import json
import asyncio

matchmaking_queue_lock = asyncio.Lock()
matchmaking_queue = {}

class MatchmakingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        from users.models import User
    
        print("Matchmaking consumer: Client Connected but not yet authenticated!")
        await self.accept()

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')

        if action == 'join_game':
            await self.handle_join_game(data)

    async def handle_join_game(self, data):

        from users.models import User
        from game.models import Game
        from jwt import decode as jwt_decode
        from django.conf import settings
        from django.contrib.auth.models import AnonymousUser
        from jwt import InvalidSignatureError, ExpiredSignatureError, DecodeError

        token = data['token']
        if token:
            try:
                data = jwt_decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                print(json.dumps(data))
                self.user = await self.get_user(data['user_id'])
            except (TypeError, KeyError, InvalidSignatureError, ExpiredSignatureError, DecodeError):
                self.user = AnonymousUser()
        else:
            self.user = AnonymousUser()

        if self.user is None or not self.user.is_authenticated and data.get("2fa_complete"):
            await self.close()
            print("LiveGame consumer: User not authenticated")
            return

        print("Matchmaking Consumer: User Authenticated!")

        if self.user.id not in matchmaking_queue:
            matchmaking_queue[self.user.id] = []
        matchmaking_queue[self.user.id].append(self)

        if len(matchmaking_queue) >= 2:
            print("test")
            player1_id, player1_connections = matchmaking_queue.popitem()
            player2_id, player2_connections= matchmaking_queue.popitem()

            game = await self.create_game(player1_connections[0].user, player2_connections[0].user)

            print("Matchmaking created this game: ", game)

            game_data = {
                "type": "game_joined",
                "game_id": game.id
            }

            for connection in player1_connections:
                await connection.send(text_data=json.dumps(game_data))
                await connection.close()
            for connection in player2_connections:
                await connection.send(text_data=json.dumps(game_data))
                await connection.close()

    @database_sync_to_async
    def get_user(self, user_id):
        from django.contrib.auth.models import AnonymousUser
        from django.contrib.auth import get_user_model

        User = get_user_model()
        """Return the user based on user id."""
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return AnonymousUser()

    async def disconnect(self, close_code):
        if self.user and self.user.id in matchmaking_queue:
            matchmaking_queue[self.user.id].remove(self)
            if len(matchmaking_queue[self.user.id]) == 0:
                del matchmaking_queue[self.user.id]
            print("Player removed from matchmaking queue.")
        await self.close()

    @database_sync_to_async
    def create_game(self, player1, player2):
        from game.models import Game
        game = Game.objects.create(
            player1=player1,
            player2=player2,
            winner=False
        )
        return game
