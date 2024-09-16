import inquirer
from models import *
from pages import *
from constants import main_choices, profile_choices, url
from colorama import Fore, Back, Style, init
import asyncio
import time

init()


# key = stdscr.getch()
#         if key == ord('w'):
#             left_paddle_y = move_paddle(left_paddle_y, max_y, -1)
#         elif key == ord('s'):
#             left_paddle_y = move_paddle(left_paddle_y, max_y, 1)
#         elif key == curses.KEY_UP:
#             right_paddle_y = move_paddle(right_paddle_y, max_y, -1)
#         elif key == curses.KEY_DOWN:
#             right_paddle_y = move_paddle(right_paddle_y, max_y, 1)

async def play(user: User):
    websocket = Websocket('ws://server:8000/ws/matchmaking/', user.access_tocken)
    print('Connecting to matchmakinh')
    await websocket.connect()
    data = await websocket.recieve()
    game_id = data.get('game_id')
    url = f'ws://server:8000/ws/live_game/{game_id}/'
    websocket = Websocket(url, user.access_tocken)
    print('Connecting to game')
    await websocket.connect()
    await websocket.send({"action": "get_init_data"})
    game: Game = {}
    print('Waiting for data')
    while True:
        data: dict = await websocket.recieve()
        if data and data.get('game_data'):
            game = Game(data.get('game_data'), websocket)
            break
        await websocket.send({"action": "get_init_data"})
    print(game)
    game.start()
    game.check_window()
    await websocket.send({"action": "player_ready"})
    while True:
        game._stdscr.clear()
        data: dict = await websocket.recieve()
        if data == None:
            break
        data = data.get('game_state', None)
        if data and data['start_time'] != 0:
            print(f'Game will start in {int(data['start_time'])}')
        elif data:
            game.draw_vert_paddle(data.get('player_1'))
            game.draw_vert_paddle(data.get('player_2'))
            game.draw_ball(data['ball']['position'])
        game._stdscr.refresh()
        time.sleep(0.1)




def profile(command, user: User):
    if command == profile_choices[0]:
        page = ProfilePages.update(user)
        answer = inquirer.prompt(page)
        user.update(answer['form'])
    elif command == profile_choices[1]:
        page = ProfilePages.update_avatar(user)
        answer = inquirer.prompt(page)
        user.upload_avatar(answer['avatar_path'])
    elif command == profile_choices[2]:
        page = ProfilePages.setup2FA(user)
        answer = inquirer.prompt(page)
        if answer['setup2FA']:
            user.setup2FA()
        else:
            print('Canceled')
            print('---------------------')
    elif command == profile_choices[3]:
        page = ProfilePages.delete(user)
        answer = inquirer.prompt(page)
        if answer['delete']:
            user.delete()
        else:
            print('Canceled')
            print('---------------------')
    elif command == profile_choices[4]:
        user.logout()
    elif command == profile_choices[5]:
        pass

async def main():
    user = User()
    answer = inquirer.prompt(Pages.main_menu(user))['Main menu']
    while True:
        if answer == main_choices[0]:
            await play(user)
        elif answer == main_choices[1]:
            page = Pages.profile(user)
            if page:
                answer = inquirer.prompt(page)['User profile']
                profile(answer, user)
        elif answer == main_choices[2]:
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

        elif answer == main_choices[3]:
            page = Pages.sign_up(user)
            if page:
                answer = inquirer.prompt(page)
                user.sign_up(answer)
        elif answer == main_choices[4]:
            Pages.exit()
        answer = inquirer.prompt(Pages.main_menu(user))['Main menu']

if __name__ == "__main__":
    asyncio.run(main())
