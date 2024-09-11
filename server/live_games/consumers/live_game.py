import random
import string
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import json

matchmaking_queue = {}

class LiveGameConsumer(AsyncWebsocketConsumer):

    def __init__(self):
        self.ball_pos = {'x': 0, 'y': 0}
        self.ball_direction = {'x': 1, 'y': 1}
        self.player1_pos = 0
        self.player2_pos = 0

    async def connect(self):
        from users.models import User

        user:User = self.scope['user']
        if user is None or not user.is_authenticated:
            await self.close()
            print("LiveGame consumer: User not authenticated")
            return
        
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.game_group_name = f'game_{self.game_id}'

        await self.channel_layer.group_add(
            self.game_group_name,
            self.channel_name
        )

        print("LiveGame consumer: User Connected!")
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.game_group_name,
            self.channel_name
        )
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