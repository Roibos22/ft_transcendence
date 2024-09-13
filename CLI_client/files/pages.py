import inquirer
from models import *
from constants import main_choices, profile_choices
from colorama import Fore, Back, Style

class Pages():
    def main_menu(user: User):
        if user.state:
            print(f'User: {user.public_name}')
            print()
        message = 'Choose to continue'
        choices=main_choices
        main_menu_page = [
            inquirer.List(
                'Main menu',
                message=message,
                choices=choices,
            )
        ]
        return main_menu_page

    def login(user: User):
        if user.state:
            print('You already logged in')
            print(Fore.GREEN + '---------------------')
            return None
        login_page = [
            inquirer.Text('username', message='Enter username'),
            inquirer.Password('password', message='Enter password')
        ]
        print(Fore.GREEN + '---------------------')
        return login_page

    def profile(user: User):
        if not user.state:
            print('You are not logged in')
            print(Fore.GREEN + '---------------------')
            return None
        user.profile()
        profile_page = [
            inquirer.List(
                'User profile',
                message='Choose to continue',
                choices=profile_choices,
            )
        ]
        print(Fore.GREEN + '---------------------')
        return profile_page

    def verify_2fa(user: User):
        verify_page = [inquirer.Text('token', message='Enter OTP token', validate=lambda _, c: c.isdigit() and 100000 <= int(c) <= 999999)]
        print(Fore.GREEN + '---------------------')
        return verify_page
    def play():
        print(Fore.GREEN + '---------------------')
        pass

    def sign_up(user: User):
        if user.state:
            print('You already logged in')
            print(Fore.GREEN + '---------------------')
            return None
        login_page = [
            inquirer.Text('username', message='username'),
            inquirer.Text('first_name', message='First name'),
            inquirer.Text('last_name', message='Last name'),
            inquirer.Text('email', message='Email'),
            inquirer.Password('password', message='Enter password')
        ]
        print(Fore.GREEN + '---------------------')
        return login_page

    def exit():
        exit()

class ProfilePages():
    def fetch_data(user: User):
        response = user.authorized_request()
        if response.status_code == 200:
            data = response.json()
            data = (
                f"User: {data['display_name']}\n"
                f"First name: {data['first_name']}\n"
                f"Last name: {data['last_name']}\n"
                f"Email: {data['email']}\n"
            )
            print(Fore.GREEN + '---------------------')
            return data
        else:
            print(Fore.GREEN + '---------------------')
            return ""
    def update(user: User):
        update_page = [inquirer.Editor("form", message="Fill out the form", default=ProfilePages.fetch_data(user))]
        return update_page
    def update_avatar(user: User):
        avatar_page = [inquirer.Path('avatar_path', message='Enter the path to file', path_type=inquirer.Path.FILE, exists=True)]
        return avatar_page
    def setup2FA(user: User):
        setup_page = [inquirer.Confirm('setup2FA', message='Setup 2FA for your user?', default=False)]
        return setup_page
    def delete(user: User):
        delete_page = [inquirer.Confirm('delete', message='Are you sure you want to delete user?', default=False)]
        return delete_page
