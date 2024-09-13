import random
screen_width = 1090 #?
screen_height = 800 #?
paddle_size = 10 #?
ball_speed = 0.005 #?

class Paddle:
    def __init__(self, side):
        self.position_top = screen_height / 2 - paddle_size / 2
        self.power = 1 # why?
        self.size = paddle_size
        self.side = side
    @property
    def position_bot(self):
        return self.position_top + paddle_size
    @property
    def position_center(self):
        return self.position_top + paddle_size / 2
    def move_paddle(self):
        pass
    def check_hit(self, ball_position):
        if self.position_top <= ball_position <= self.position_bot:
            return (ball_position - self.position_center) / (paddle_size / 2)
        return None

class Ball:

    def __init__(self, walls: dict, screen_size: dict):
        self.top = walls.get('N', False)
        self.bot = walls.get('S', False)
        self.left = walls.get('W', False)
        self.right = walls.get('E', False)
        self._screen_size = screen_size
        self._position_x = round(self._screen_size.get('width') / 2)
        self._position_y = round(self._screen_size.get('height') / 2)

        self.speed = ball_speed

        self._direction_x = random.choice([1, -1])
        self._direction_y = random.choice([1, -1])

    @property
    def position(self):
        return {'x': self._position_x, 'y': self._position_y}

    def paddle_hit(self, paddle: Paddle):
        paddle_hit = paddle.check_hit()
        if paddle_hit != None:
            self._direction_x *= -1
        if paddle_hit > 0 and self._direction_y <= 0:
            self._direction_y *= -1
        elif paddle_hit < 0 and self._direction_y >= 0:
            self._direction_y *= -1


    def movement(self, left_paddle: Paddle, right_paddle: Paddle, top_paddle: Paddle, bottom_paddle: Paddle):
        # Ball movement
        self._position_x += self._direction_x * self.speed
        self._position_y += self._direction_y * self.speed
        # Wall collisions
        if self.top and self._position_y <= 1:
            self._direction_y *= -1
        if self.bot and self._position_y >= self._screen_size.get('height') - 2:
            self._direction_y *= -1
        if self.left and self._position_x <= 1:
            self._direction_x *= -1
        if self.right and self._position_x >= self._screen_size.get('width') - 2:
            self._direction_x *= -1
        # Paddle collisions
        if not self.left and self._position_x == 1:
            self.paddle_hit(left_paddle)
        elif not self.right and self._position_x == self._screen_size.get('x') - 2:
            self.paddle_hit(right_paddle)
        elif not self.top and self._position_y == 1:
            self.paddle_hit(top_paddle)
        elif not self.bot and self._position_y == self._screen_size.get('y') - 2:
            self.paddle_hit(bottom_paddle)




class Game:
    def __init__(self, game_id):
        self.game_id = game_id
        self.screen_size = {'height': screen_height, 'width': screen_width}
        self.player1_pos: Paddle = Paddle('Left') # left player
        self.player2_pos: Paddle = Paddle('Right') # right player
        self.ball: Ball = Ball({'N': True, 'S': True, 'W': False, 'E': False}, self.screen_size) # Set walls to True

    def run_tick(self):
        self.ball.movement()

    def move_paddle(self, side: str):
        if side == 'Left':
            self.player1_pos.move_paddle()
        if side == 'Right':
            self.player2_pos.move_paddle()


