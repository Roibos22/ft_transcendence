import requests
import json
from constants import url
import urllib.parse
from colorama import Fore, Back, Style
import websockets
import curses

class User:
    id:int=None
    username:str=None
    public_name:str=None
    state:bool=False
    access_tocken:str=None
    refresh_tocken:str=None
    auth_2fa:bool=False

    def auth_header(self):
        headers = {
            'Accept': 'application/json',
            'User-Agent': 'my-app/1.0',
            'Authorization': f'Bearer {self.access_tocken}',
        }
        return headers
    def authorized_request(self):
        headers = self.auth_header()
        username_encoded = urllib.parse.quote(self.username)
        response = requests.get(f'{url}profile/{username_encoded}/', headers=headers)
        return response

    def fetch_data(self):
        response = self.authorized_request()
        if response.status_code == 200:
            data = response.json()
            self.public_name = data['display_name']
            self.id = data['id']
            return True
        else:
            print(f"Error: {response.status_code}")
            print(Fore.GREEN + '---------------------')
            return False

    def login(self, data):
        # Send a GET request to the API
        response = requests.post(f'{url}login/', json=data)

        # Check if the request was successful
        if response.status_code == 200:
            data = response.json()
            with open("tokens.json", "w") as file:
                json.dump(data['tokens'], file, indent=4)
            # print(data)
            self.state=True
            self.username=data['username']
            self.access_tocken=data['tokens']['access']
            self.refresh_tocken=data['tokens']['refresh']
            if not response.json()['2fa_required']:
                print("Logged in successfully")
                print(Fore.GREEN + '---------------------')
                self.auth_2fa=True
                self.fetch_data()
            return True
        else:
            print(f"Error: {response.status_code}")
            print(Fore.GREEN + '---------------------')
            return False

    def profile(self):
        if self.access_tocken == None:
            print('You are not logged in')
            print(Fore.GREEN + '---------------------')
            return False
        response = self.authorized_request()
        if response.status_code == 200:
            data = response.json()
            print("User data:")
            print(f"User: {data['display_name']}")
            print(f"First name: {data['first_name']}")
            print(f"Last name: {data['last_name']}")
            print(f"Email: {data['email']}")
            print(f"Games: {data['games']}")
            print(f"Friends: {data['friends']}")
            print(Fore.GREEN + '---------------------')
            return True
        else:
            print(f"Error: {response.status_code}")
            print(Fore.GREEN + '---------------------')
            return False
    def update(self, data: str):
        data_lines = data.strip().split("\n")
        data_dict = {}
        serial_dict = {
            'User': 'display_name',
            'First name': 'first_name',
            'Last name': 'last_name',
            'Email': 'email',
        }
        headers = self.auth_header()
        for line in data_lines:
            key, value = line.split(": ", 1)
            key = serial_dict.get(key)
            data_dict[key] = value
        response = requests.patch(f'{url}profile/{self.id}/update/', json=data_dict, headers=headers)
        if response.status_code == 200:
            print('Your data updated')
            print(Fore.GREEN + '---------------------')
        else:
            print(f'Error code: {response.status_code}')
            print(Fore.GREEN + '---------------------')
    def upload_avatar(self, path):
        headers = self.auth_header()
        file_data = {
            'avatar': open(path, 'rb')
        }
        response = requests.patch(f'{url}profile/{self.id}/update/', headers=headers, files=file_data)
        if response.status_code == 200:
            print('Your avatar updated')
            print(Fore.GREEN + '---------------------')
        else:
            print(f'Error code: {response.status_code}')
            print(Fore.GREEN + '---------------------')
    def delete(self):
        headers = self.auth_header()
        response = requests.delete(f'{url}profile/{self.id}/delete/', headers=headers)
        if response.status_code == 204:
            print('Your profile deleted')
            print(Fore.GREEN + '---------------------')
        else:
            print(f'Error code: {response.status_code}')
            print(f'Error message: {response.text}')
            print(Fore.GREEN + '---------------------')
        self.id=None
        self.username=None
        self.public_name=None
        self.state=False
        self.access_tocken=None
        self.refresh_tocken=None
        self.auth_2fa=False

    def setup2FA(self):
        headers = self.auth_header()
        response = requests.get(f'{url}2fa/setup/', headers=headers)
        if response.status_code == 200:
            print(f"link for 2FA OTP: {response.json()['qr_code_url']}")
            print(Fore.GREEN + '---------------------')
        else:
            print(f'Error: {response.status_code}')
            print(Fore.GREEN + '---------------------')

    def verify(self, token):
        headers = self.auth_header()
        response = requests.post(f'{url}2fa/verify/', headers=headers, json={'otp':token})
        if response.status_code == 200:
            print('You are logged in')
            print(Fore.GREEN + '---------------------')
            self.auth_2fa=True
            self.fetch_data()
            return True
        else:
            print(f'Error: {response.status_code}')
            print(Fore.GREEN + '---------------------')
            return False
    def logout(self):
        self.id=None
        self.username=None
        self.public_name=None
        self.state=False
        self.access_tocken=None
        self.refresh_tocken=None
        self.auth_2fa=False
        print('User logged out')
        print(Fore.GREEN + '---------------------')
    def sign_up(self, answers):
        response = requests.post(f'{url}create/', json=answers)
        if response.status_code == 201:
            print('User created')
            print(Fore.GREEN + '---------------------')
        else:
            print(f'Error: {response}')
            print(Fore.GREEN + '---------------------')
        # answers = answers['form']

class Websocket:
    def __init__(self, uri, token):
        self.uri = uri
        self.token = token
        self.websocket = None

    async def  connect(self):
        self.websocket = await websockets.connect(self.uri, extra_headers={'Authorization': f'Bearer {self.token}'})
    async def send(self, data):
        try:
            await self.websocket.send(json.dumps(data))
        except websockets.exceptions.ConnectionClosed:
            print('Wesocket: no connection on send')
    async def recieve(self):
        try:
            data: json = await self.websocket.recv()
            if data:
                return json.loads(data)
        except websockets.exceptions.ConnectionClosed:
            print('Wesocket: no connection on recv')
            return None
    async def close(self):
        if self.websocket:
            await self.websocket.close()



class Game:
    def __init__(self, data: dict, websocket):
        self.websocket: Websocket = websocket
        self._game_width = data['maze']['width']
        self._game_height = data['maze']['height']
        self._paddle_size = data['paddle_size']
        self._no_players = data['no_players']
        self._player_no = data['player_no']

    def retrieve_data(self):
        pass

    def start(self):
        curses.wrapper(self.main)
    def main(self, stdscr):
        self._stdscr = stdscr
        curses.curs_set(0)
        curses.noecho()
        stdscr.keypad(True)
        self._stdscr.clear()
        self._stdscr.nodelay(1)
        self._stdscr.timeout(100)

    def check_window(self):
        max_y, max_x = self._stdscr.getmaxyx()

    # Check if terminal is at the required size
        if max_y != self._game_height or max_x != self._game_width:
            # If not, display a message and wait for resizing
            self._stdscr.clear()
            self._stdscr.addstr(0, 0, f"Please resize your terminal to {self._game_width}x{self._game_height}.")
            self._stdscr.refresh()

            # Wait for the user to resize the terminal
            while max_y != self._game_height or max_x != self._game_width:
                max_y, max_x = self._stdscr.getmaxyx()
                self._stdscr.clear()
                self._stdscr.addstr(0, 0, f"Current size: {max_x}x{max_y}. Please resize your terminal to {self._game_width}x{self._game_height}.")
                self._stdscr.refresh()

    def draw_vert_paddle(self, paddle: dict):
        pos_bot: int = int(paddle.get('bot_position'))
        pos_top: int = int(paddle.get('top_position'))
        x: int = 1 if paddle.get('side') == 'Left' else self._game_width - 2
        for i in range(pos_top, pos_bot):
            max_y, max_x = self._stdscr.getmaxyx()
            # print(f'Max_y: {max_y}, max_x: {max_x}, paddle_top: {pos_top}, paddle_bot: {pos_bot}, current_y: {i}')
            if 0 <= i < max_y and 0 <= x < max_x:
                self._stdscr.addch(i, x, '|')
            if x == self._game_width - 1:
                if 0 <= i < max_y and 0 <= x - 1 < max_x:
                    self._stdscr.addch(i, x - 1, '|')
            else:
                if 0 <= i < max_y and 0 <= x + 1 < max_x:
                    self._stdscr.addch(i, x + 1, '|')
        self._stdscr.refresh()

    def draw_ball(self, ball_pos:dict):
        ball_y: int = int(ball_pos.get('y'))
        ball_x: int = int(ball_pos.get('x'))
        if 0 <= ball_y <= self._game_height - 1 and 0 <= ball_x <= self._game_width - 1:
            self._stdscr.addch(ball_y, ball_x, '0')
        self._stdscr.refresh()

    async def move_paddle(self, key):
        if key == curses.KEY_UP:
            print("key up")
            self.websocket.send({
                "action": "move_player",
                "direction": 1
            })
        elif key == curses.KEY_DOWN:
            print("key up")
            self.websocket.send({
                "action": "move_player",
                "direction": -1
            })


