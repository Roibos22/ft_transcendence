GAME_WIDTH = 200
GAME_HEIGHT = 100
PLAYER_SIZE = 10
PLAYER_STEP = 1

class GameLogic():

    def __init__(self):   
        self.ball_pos = {'x': 0, 'y': 0}
        self.ball_direction = {'x': 1, 'y': 1}
        self.player1_pos = (GAME_HEIGHT / 2) - (PLAYER_SIZE / 2)
        self.player2_pos = (GAME_HEIGHT / 2) - (PLAYER_SIZE / 2)
        self.player1_ready = False
        self.player2_ready = False

    def get_state_dict(self):
        state_dict = {
            'player1_pos': self.player1_pos,
            'player2_pos': self.player2_pos,
            'ball_pos': self.ball_pos,
        }
        return state_dict

    def move_player1(self, direction):
            new_player_pos = self.player1_pos + (direction * PLAYER_STEP)
            if new_player_pos >= PLAYER_SIZE and new_player_pos <= 100:
                self.player1_pos = new_player_pos

    def move_player2(self, direction):
            new_player_pos = self.player2_pos + (direction * PLAYER_STEP)
            if new_player_pos >= PLAYER_SIZE and new_player_pos <= 100:
                self.player2_pos = new_player_pos
                
    def set_player_1_ready(self):
        self.player1_ready = True

    def set_player_2_ready(self):
        self.player2_ready = True

            

