import random
import string
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from game.models import Game
from channels.db import database_sync_to_async



# ************************************** This can  be moved
# from rest_framework.permissions import BasePermission

# class Is2FAComplete(BasePermission):
#     """
#     Custom permission to check if the user has completed 2FA.
#     Only allows access if 2fa_complete is True in the JWT.
#     """
#     def has_permission(self, request):
#         # Check if '2fa_complete' claim exists in the JWT and is True
#         if request.user and request.user.is_authenticated:
#             return getattr(request.user, 'is_2fa_complete', False)
#         return False




matchmaking_queue = []

class MatchmakingConsumer(AsyncWebsocketConsumer):
    async def connect(self):

        matchmaking_queue.append(self)

        if len(matchmaking_queue) >= 2:
            player1 = matchmaking_queue.pop(0)
            player2 = matchmaking_queue.pop(0)

            game = await self.create_game(player1.scope['user'], player2.scope['user'])

            await player1.send(text_data=str(game.id))
            await player2.send(text_data=str(game.id))

            await player1.close()
            await player2.close()

        await self.accept()

    async def disconnect(self, close_code):
        if self in matchmaking_queue:
            matchmaking_queue.remove(self)

    @database_sync_to_async
    def create_game(self, player1, player2):
        # Create a new game instance in the database
        game = Game.objects.create(
            player1=player1,  # Assuming `self.user` is the user associated with the WebSocket
            player2=player2,
            winner=None
        )
        return game