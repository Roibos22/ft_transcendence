import random
import string
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import json
from asgiref.sync import sync_to_async

# live_games = {
#     1: new live_game()
#     5: new live_game()
# }

# live_games[1]

# self.ball_pos = {'x': 0, 'y': 0}
# self.ball_direction = {'x': 1, 'y': 1}
# self.player1_pos = 0
# self.player2_pos = 0
# self.player1_ready = False
# self.player2_ready = False

class LiveGameConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        from users.models import User
        from game.models import Game

        user:User = self.scope['user']
        if user is None or not user.is_authenticated:
            await self.close()
            print("LiveGame consumer: User not authenticated")
            return

        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.game_group_name = f'game_{self.game_id}'
        # self.game = await sync_to_async(Game.objects.get)(id=self.game_id)

        await self.channel_layer.group_add(
            self.game_group_name,
            self.channel_name
        )

        print("LiveGame consumer: User Connected!")

        await self.accept()

        # check if user in game

        # create single instance of game class

    async def receive(self, text_data):
        import json
        data = json.loads(text_data)


        if data.get('action') == 'message':
            await self.handle_receive_message(data)

        # if data.get('action') == 'ready':
        #     await self.handle_ready()

        elif data.get('action') == 'move':
            await self.handle_move(data)

    async def handle_move(data) {

    }
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

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.game_group_name,
            self.channel_name
        )
        await self.close()
