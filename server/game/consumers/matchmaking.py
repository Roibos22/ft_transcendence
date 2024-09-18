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

        user:User = self.scope['user']
        if user is None or not user.is_authenticated:
            await self.close()  # Close the connection if not authenticated
            print("Matchmaking consumer: User not authenticated")
            return

        print("Matchmaking consumer: User Connected!")
        await self.accept()

        async with matchmaking_queue_lock:

            if user.id not in matchmaking_queue:
                matchmaking_queue[user.id] = []
            matchmaking_queue[user.id].append(self)

            if len(matchmaking_queue) >= 2:
                player1_id, player1_connections = matchmaking_queue.popitem()
                player2_id, player2_connections = matchmaking_queue.popitem()

                game = await self.create_game(player1_connections[0].scope['user'], player2_connections[0].scope['user'])

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
