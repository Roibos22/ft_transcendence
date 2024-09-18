GAME_WIDTH = 200
GAME_HEIGHT = 100
PLAYER_SIZE = 10
PLAYER_STEP = 1

class GameLogic():

    def __init__(self, player1_username, player2_username):   
        self.ball_pos = {'x': 0, 'y': 0}
        self.ball_direction = {'x': 1, 'y': 1}
        self.player1_pos = (GAME_HEIGHT / 2) - (PLAYER_SIZE / 2)
        self.player2_pos = (GAME_HEIGHT / 2) - (PLAYER_SIZE / 2)
        self.player1_ready = False
        self.player2_ready = False
        self.player1_username = player1_username
        self.player2_username = player2_username

    def get_state_dict(self):
        state_dict = {
            'player1_username': self.player1_username,
            'player2_username': self.player2_username,
            'player1_pos': self.player1_pos,
            'player2_pos': self.player2_pos,
            'player1_ready': self.player1_ready,
            'player2_ready': self.player2_ready,
            'ball_pos': self.ball_pos,
            'ball_direction': self.ball_direction,
        }
        return state_dict

    def move_player(self, username, direction):
        if username == self.player1_username:
            new_player_pos = self.player1_pos + (direction * PLAYER_STEP)
            if new_player_pos >= PLAYER_SIZE and new_player_pos <= 100:
                self.player1_pos = new_player_pos
        else:
            new_player_pos = self.player2_pos + (direction * PLAYER_STEP)
            if new_player_pos >= PLAYER_SIZE and new_player_pos <= 100:
                self.player2_pos = new_player_pos