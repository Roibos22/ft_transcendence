import requests
import json
from constants import url
import urllib.parse

class User():
    id:int=None
    username:str=None
    public_name:str=None
    state:bool=False
    access_tocken:str=None
    refresh_tocken:str=None

    def auth_header(self):
        headers = {
            'Accept': 'application/json',
            'User-Agent': 'my-app/1.0',
            'Content-Type': 'application/json',
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
            return False

    def login(self, data):
        # Send a GET request to the API
        response = requests.post(f'{url}login/', json=data)

        # Check if the request was successful
        if response.status_code == 200:
            data = response.json()
            with open("tokens.json", "w") as file:
                json.dump(data['tokens'], file, indent=4)

            print("Logged in successfully")
            # print(data)
            self.state=True
            self.username=data['username']
            self.access_tocken=data['tokens']['access']
            self.refresh_tocken=data['tokens']['refresh']
            self.fetch_data()
            return True
        else:
            print(f"Error: {response.status_code}")
            return False

    def profile(self):
        if self.access_tocken == None:
            print('You are not logged in')
            return False
        response = self.authorized_request()
        if response.status_code == 200:
            data = response.json()
            print(f'User: {data['display_name']}')
            print(f'First name: {data['first_name']}')
            print(f'Last name: {data['last_name']}')
            print(f'Email: {data['email']}')
            print(f'Games: {data['games']}')
            print(f'Friends: {data['friends']}')
            return True
        else:
            print(f"Error: {response.status_code}")
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
        else:
            print(f'Error code: {response.status_code}')
    def delete(self):
        headers = self.auth_header()
        response = requests.delete(f'{url}profile/delete/', headers=headers)
        if response.status_code == 204:
            print('Your profile deleted')
        else:
            print(f'Error code: {response.status_code}')
        self.id=None
        self.username=None
        self.public_name=None
        self.state=False
        self.access_tocken=None
        self.refresh_tocken=None

    def setup2FA(self):
        headers = self.auth_header()
        response = requests.get(f'{url}2fa/setup/', headers=headers)
        if response.status_code == 200:
            print(f'link for 2FA OTP: {response.json()['qr_code_url']}')
        else:
            print(f'Error: {response.status_code}')


