import inquirer
from modules import *
from pages import *

def profile(command, user: User):
    print('---------------------')
    if command == 'Update profile':
        page = ProfilePages.update(user)
        answer = inquirer.prompt(page)
        user.update(answer['form'])
    elif command == 'Upload profile picture':
        page = ProfilePages.update_avatar(user)
        answer = inquirer.prompt(page)
        user.upload_avatar(answer['avatar_path'])
    elif command == 'Setup 2FA':
        page = ProfilePages.setup2FA(user)
        answer = inquirer.prompt(page)
        if answer['setup2FA']:
            user.setup2FA()
        else:
            print('Canceled')
    elif command == 'Delete':
        page = ProfilePages.delete(user)
        answer = inquirer.prompt(page)
        if answer['delete']:
            user.delete()
        else:
            print('Canceled')
    elif command == 'Back':
        pass

def main():
    user = User()
    answer = inquirer.prompt(Pages.main_menu(user))['Main menu']
    while True:
        print('---------------------')
        if answer == 'Login':
            page = Pages.login(user)
            if page:
                answer = inquirer.prompt(page)
                user.login(answer)
                i = 0
                while not user.auth_2fa and user.state:
                    i+=1
                    page = Pages.verify_2fa(user)
                    answer = inquirer.prompt(page)
                    user.verify(answer['token'])
                    if i > 3:
                        user.logout()
                        break
        elif answer == 'Play':
            page = Pages.play()
        elif answer == 'Profile':
            page = Pages.profile(user)
            if page:
                answer = inquirer.prompt(page)['User profile']
                profile(answer, user)
        elif answer == 'Exit':
            Pages.exit()
        answer = inquirer.prompt(Pages.main_menu(user))['Main menu']

if __name__ == "__main__":
    main()
