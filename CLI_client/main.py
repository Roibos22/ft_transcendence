import inquirer
from modules import *
from pages import *

def profile(answer, user: User):
    print('---------------------')
    if answer == 'Update profile':
        page = ProfilePages.update(user)
        answer = inquirer.prompt(page)
        user.update(answer['form'])
    elif answer == 'Setup 2FA':
        page = ProfilePages.setup2FA(user)
        answer = inquirer.prompt(page)
        if answer:
            user.setup2FA()
        else:
            print('Canceled')
    elif answer == 'Delete':
        page = ProfilePages.delete(user)
        answer = inquirer.prompt(page)
        if answer:
            user.delete()
        else:
            print('Canceled')
    elif answer == 'Back':
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
