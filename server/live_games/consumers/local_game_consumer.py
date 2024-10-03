from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import json
from asgiref.sync import sync_to_async
from live_games.game import GameLogic
import asyncio

game_sessions = {}

class LocalGameConsumer(AsyncWebsocketConsumer):

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
                await self.handle_move(data)
            elif action == 'get_init_data':
                await self.send_init_data()
            elif action == 'message':
                await self.handle_receive_message(data)

    async def send_init_data(self):
        await self.send(text_data=json.dumps({"game_data": game_sessions[self.game_id].get_init_data()}))

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
            print("LocalGameConsumer: User not authenticated")
            return

        print("LocalGameConsumer: User Authenticated!")

        self.game_id = self.scope['url_route']['kwargs']['game_id']

        game = await sync_to_async(Game.objects.get)(id=self.game_id)
        game_creator = await database_sync_to_async(lambda: game.created_by)()

        if self.user.username != game_creator:
            print("LocalGameConsumer: User does not have access to this game.")
            await self.close()
            return

        if (self.game_id not in game_sessions):
            game_sessions[self.game_id] = GameLogic(self.game_id, self.user.username, self.user.username)

        print("LocalGameConsumer: User Connected! Username: ", self.user.username)
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

    async def handle_player_ready(self, data):
        if int(data['player_no']) == 1:
            game_sessions[self.game_id].set_player1_ready()
        elif int(data['player_no']) == 2:
            game_sessions[self.game_id].set_player2_ready()

    async def handle_move(self, data):
        if int(data['player_no']) == 1:
            game_sessions[self.game_id].move_player1(int(data['direction']))
        elif int(data['player_no']) == 2:
            game_sessions[self.game_id].move_player2(int(data['direction']))

    async def send_game_updates(self):
        try:
            while True:
                game_state = {"game_state": game_sessions[self.game_id].get_state()}
                await self.send(text_data=json.dumps(game_state))
                await asyncio.sleep(0.016) # 60 fps NEED TO CHANGE THIS

        except asyncio.CancelledError:
            pass

    async def disconnect(self, close_code):
        if hasattr(self, 'periodic_task'):
            self.periodic_task.cancel()
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
