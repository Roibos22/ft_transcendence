import inquirer
from modules import *

class Pages():
    def main_menu(user: User):
        if user.state:
            print('---------------------')
            print(f'User: {user.public_name}')
            print()
        message = 'Choose to continue'
        choices=['Play', 'Profile', 'Login', 'Exit']
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
            return None
        login_page = [
            inquirer.Text('username', message='Enter username'),
            inquirer.Password('password', message='Enter password')
        ]
        return login_page

    def profile(user: User):
        if not user.state:
            print('You are not logged in')
            return None
        user.profile()
        profile_page = [
            inquirer.List(
                'User profile',
                message='Choose to continue',
                choices=['Update profile', 'Upload profile picture', 'Setup 2FA', 'Delete', 'Back'],
            )
        ]
        return profile_page

    def verify_2fa(user: User):
        verify_page = [inquirer.Text('token', message='Enter OTP token', validate=lambda _, c: c.isdigit() and 100000 <= int(c) <= 999999)]
        return verify_page
    def play():
        pass

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
            return data
        else:
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
