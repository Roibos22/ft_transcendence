import random
import string
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

matchmaking_queue = []

class MatchmakingConsumer(AsyncWebsocketConsumer):
    async def connect(self):

        matchmaking_queue.append(self)

        if len(matchmaking_queue) >= 2:
            player1 = matchmaking_queue.pop(0)
            player2 = matchmaking_queue.pop(0)

            game_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

            await player1.send(text_data=game_id)
            await player2.send(text_data=game_id)

            await player1.close()
            await player2.close()

        await self.accept()

    async def disconnect(self, close_code):
        # Remove player from matchmaking queue if they disconnect
        if self in matchmaking_queue:
            matchmaking_queue.remove(self)