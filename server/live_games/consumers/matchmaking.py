import random
import string
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import json

matchmaking_queue = {}

class LiveGame(AsyncWebsocketConsumer):

    def __init__(self):
        self.ball_x = 0

    async def connect(self):
        from users.models import User
        from game.models import Game

        user:User = self.scope['user']
        if user is None or not user.is_authenticated:
            await self.close()  # Close the connection if not authenticated
            print("LiveGame consumer: User not authenticated")
            return
        
        print("LiveGame consumer: User Connected!")
        await self.accept()

    async def disconnect(self, close_code):
        user = self.scope['user']
        if user.id in matchmaking_queue:
            matchmaking_queue[user.id].remove(self)
            if len(matchmaking_queue[user.id]) == 0:
                del matchmaking_queue[user.id]
            print("Player removed form matchmaking queue.")
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