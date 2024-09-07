import requests
import inquirer
from modules import *
from constants import *

# Example URL (replace with your API endpoint)

def main ():
    user = User()
    answer = inquirer.prompt(Pages.main_menu(user))['Main menu']
    print(answer)

    if answer == 'Login':
        answer = inquirer.prompt(Pages.login())
        user.login(answer)
    elif answer == 'Play':
        Pages.play()
    elif answer == 'Exit':
        Pages.exit()

if __name__ == "__main__":
    main()
