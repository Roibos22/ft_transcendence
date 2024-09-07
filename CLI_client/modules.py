import inquirer
import requests
import json
from constants import url
import urllib.parse

class User():
    username=None
    public_name=None
    state=False
    access_tocken=None
    refresh_tocken=None

    def fetch_data(self):
        headers = {
            'Accept': 'application/json',
            'User-Agent': 'my-app/1.0',
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.access_tocken}',
        }
        username_encoded = urllib.parse.quote(self.username)
        response = requests.get(f'{url}/login/{username_encoded}', headers=headers)
        data = response.json()
        self.public_name = data['display_name']
    def login(self, data):
        # Send a GET request to the API
        response = requests.post(f'{url}login/', json=data)

        # Check if the request was successful
        if response.status_code == 200:
            data = response.json()
            with open("tokens.json", "w") as file:
                json.dump(data['tokens'], file, indent=4)

            print("Logged in successfully")

            self.username=data['username']
            self.state=True
            self.access_tocken=data['tokens']['access']
            self.refresh_tocken=data['token']['refresh']
            # self.fetch_data()
            return True
        else:
            print(f"Error: {response.status_code}")
            return False


class Pages():
    def main_menu(user: User):
        message = f"User: {user.public_name}\n\n Choose to continue" if user.state else "Choose to continue"
        choices=['Play', 'Login', 'Exit']
        main_menu_page = [
            inquirer.List(
                'Main menu',
                message=message,
                choices=choices,
            )
        ]
        return main_menu_page
    def login():
        login_page = [
            inquirer.Text('username', message='Enter username'),
            inquirer.Password('password', message='Enter password')
        ]
        return login_page
    def play():
        pass

    def exit():
        exit()

