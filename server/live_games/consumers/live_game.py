from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import json
from asgiref.sync import sync_to_async
from live_games.game import GameLogic
import asyncio

game_sessions = {}

class LiveGameConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        
        self.user_is_authenticated = False
        await self.accept()

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')

        if action == 'authenticate':
            await self.handle_authenticate(data)
        elif self.user_is_authenticated:
            if action == 'get_state':
                await self.handle_get_state()
            elif action == 'player_ready':
                await self.handle_player_ready()
            elif action == 'move_player':
                print("LiveGame Consumer: Move Player" + str(data))
                await self.handle_move(data)
            elif action == 'get_init_data':
                await self.send_init_data()
            elif action == 'message':
                await self.handle_receive_message(data)

    async def send_init_data(self):
        await self.send(text_data=json.dumps({"game_data": game_sessions[self.game_id].get_init_data(self.user_player_no)}))

    async def handle_authenticate(self, data):

        from users.models import User
        from game.models import Game
        from jwt import decode as jwt_decode
        from django.conf import settings
        from django.contrib.auth.models import AnonymousUser
        from jwt import InvalidSignatureError, ExpiredSignatureError, DecodeError

        token = data.get('token')
        if token:
            try:
                data = jwt_decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                print(json.dumps(data))
                self.user = await self.get_user(data['user_id'])
            except (TypeError, KeyError, InvalidSignatureError, ExpiredSignatureError, DecodeError):
                self.user = AnonymousUser()
        else:
            self.user = AnonymousUser()

        if not self.user.is_authenticated or not data.get("2fa_complete"):
            await self.close()
            print("LiveGame consumer: User not authenticated")
            return

        print("LiveGame Consumer: User Authenticated!")

        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.game_group_name = f'game_{self.game_id}'
        game = await sync_to_async(Game.objects.get)(id=self.game_id)
        players_username = await database_sync_to_async(
            lambda: (game.player1.username,game.player2.username)
        )()

        if self.user.username == players_username[0]:
            self.user_player_no = 1
        elif self.user.username == players_username[1]:
            self.user_player_no = 2
        else:
            print("LiveGame consumer: User is not part of this game")
            await self.close()
            return

        await self.channel_layer.group_add(
            self.game_group_name,
            self.channel_name
        )

        if (self.game_id not in game_sessions):
            game_sessions[self.game_id] = GameLogic(self.game_id)

        print("LiveGame consumer: User Connected! Username: ", self.user.username)
        self.user_is_authenticated = True
        self.periodic_task = asyncio.create_task(self.send_game_updates())

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

    async def handle_get_state(self):
        await self.send(text_data=json.dumps({"game_state": game_sessions[self.game_id].get_state()}))

    async def handle_player_ready(self):
        if self.user_player_no == 1:
            game_sessions[self.game_id].set_player1_ready()
        elif self.user_player_no == 2:
            game_sessions[self.game_id].set_player2_ready()

    async def handle_move(self, data):
        if self.user_player_no == 1:
            game_sessions[self.game_id].move_player1(int(data['direction']))
        elif self.user_player_no == 2:
            game_sessions[self.game_id].move_player2(int(data['direction']))

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

    async def send_game_updates(self):
        try:
            while True:
<<<<<<< HEAD
                game_state = {"game_state": game_sessions[self.game_id].get_state()}
                await self.send(text_data=json.dumps(game_state))
                await asyncio.sleep(0.)
=======
                await self.send(text_data=json.dumps({"game_state": game_sessions[self.game_id].get_state()}))
                await asyncio.sleep(0.1)
>>>>>>> b0d6c6bcad16a5b269faeeabb2ff98597b9eee0d

        except asyncio.CancelledError:
            pass


    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.game_group_name,
            self.channel_name
        )
        if hasattr(self, 'periodic_task'):
            self.periodic_task.cancel()
        await self.close()
