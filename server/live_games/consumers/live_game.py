import random
import string
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import json
from asgiref.sync import sync_to_async
from live_games.game_logic.game_logic import GameLogic
import asyncio

game_sessions = {}

class LiveGameConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        from users.models import User
        from game.models import Game

        self.user:User = self.scope['user']
        if self.user is None or not self.user.is_authenticated:
            await self.close()
            print("LiveGame consumer: User not authenticated")
            return

        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.game_group_name = f'game_{self.game_id}'
        game = await sync_to_async(Game.objects.get)(id=self.game_id)
        player1_username = await database_sync_to_async(lambda: game.player1.username)()
        player2_username = await database_sync_to_async(lambda: game.player2.username)()

        # remove player if not part of game...

        await self.channel_layer.group_add(
            self.game_group_name,
            self.channel_name
        )

        if (self.game_id not in game_sessions):
            game_sessions[self.game_id] = GameLogic(player1_username, player2_username)

        print("LiveGame consumer: User Connected! Username: ", self.user.username)

        await self.accept()

        # check if user in game

        # create single instance of game class

        self.periodic_task = asyncio.create_task(self.send_periodic_message())

    async def receive(self, text_data):
        import json
        data = json.loads(text_data)

        if data.get('action') == 'message':
            await self.handle_receive_message(data)
        elif data.get('action') == 'get_state':
            await self.handle_get_state()
        # elif data.get('action') == 'player_ready':
        #     await self.handle_get_state()
        elif data.get('action') == 'move':
            await self.handle_move(data)

    async def handle_get_state(self):
        await self.send(text_data=json.dumps({"game_state": game_sessions[self.game_id].get_state_dict()}))

    async def handle_move(self, data):
        # take care of identifying the user here 
        game_sessions[self.game_id].move_player(self.user.username, int(data['direction']))

    async def handle_receive_message(self, message):
        await self.channel_layer.group_send(
            self.game_group_name,
            {
                'type': 'chat_message',
                'message': message['content']
            }
        )

    async def chat_message(self, event):
        message = event["message"]
        await self.send(text_data=json.dumps({"message": message}))

    async def send_periodic_message(self):
        """ Send a message to the client at regular intervals """
        try:
            while True:
                # Replace this with the message you want to send
                await self.send(text_data=json.dumps({"message": "Periodic update"}))

                # Sleep for the desired interval (e.g., 10 seconds)
                await asyncio.sleep(3)

        except asyncio.CancelledError:
            # Task was cancelled, safely exit
            pass


    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.game_group_name,
            self.channel_name
        )
        await self.close()