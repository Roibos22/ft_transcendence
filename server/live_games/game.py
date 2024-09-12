screen_width = 1090 #?
screen_height = 800 #?
paddle_size = 10 #?
ball_speed = 0.005 #?

class Paddle:
    def __init__(self, position_top):
        self.position_top = position_top

    @property
    def position_bot(self):
        return self.position_top + paddle_size
    @property
    def position_center(self):
        return self.position_top + paddle_size / 2
    async def move_paddle(self):
        pass
    async def check_hit(self, ball_y_pos):
        if self.position_top <= ball_y_pos <= self.position_bot:
            return (ball_y_pos - self.position_center) / paddle_size
        return False


class Game:
    def __init__(self, game_id, player1_pos: int, player2_pos: int, ball_pos: dict, ball_direction: dict):
        self.game_id = game_id
        self.player1_pos: Paddle = Paddle(player1_pos)
        self.player2_pos: Paddle = Paddle(player2_pos)
        self.ball_pos = ball_pos
        self.ball_speed = ball_speed
        self.ball_direction = ball_direction

    async def ball_movement(self):
        self.ball_pos['x'] += self.ball_direction['x'] * self.ball_speed
        self.ball_pos['y'] += self.ball_direction['y'] * self.ball_speed

        if self.ball_pos['x'] <= 1 or self.ball_pos['x'] >= screen_width - 1:
            self.ball_direction['x'] *= -1
        if self.ball_pos['y'] <= 1 or self.ball_pos['y'] >= screen_height - 1:
            self.ball_direction['y'] *= -1

        if
