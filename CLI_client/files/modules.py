import requests
import json
from constants import url
import urllib.parse
from colorama import Fore, Back, Style
import asyncio
import websockets

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
    def __init__(self, uri):
        self.uri = uri
        self.websocket = None

    async def  connect(self):
        self.websocket = await websockets.connect(self.uri)
        print('Joining the game')
    async def send(self, data):
        try:
            await self.websocket.send(data)
        except websockets.exceptions.ConnectionClosed:
            print('Wesocket: no connection')
    async def recieve(self):
        try:
            data = await self.websocket.recv()
            return data
        except websockets.exceptions.ConnectionClosed:
            print('Wesocket: no connection')
    async def close(self):
        if self.websocket:

            await self.websocket.close()
