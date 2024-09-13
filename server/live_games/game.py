import random
import time
screen_width = 100 #?
screen_height = 50 #?
paddle_size = 10 #?
ball_speed = 1 #?

class Paddle:
    def __init__(self, side, dimention, paddle_size):
        self.dimention = dimention
        self.size = paddle_size
        self.power = 1 # why?
        self.side = side
        self.position_top = dimention / 2 - paddle_size / 2
    @property
    def position_bot(self):
        return self.position_top + self.size
    @property
    def position_center(self):
        return self.position_top + self.size / 2
    def move_paddle(self, direction: int):
        if direction < 0 and self.position_top >= - direction:
            self.position_top += direction
        elif direction > 0 and self.position_bot <= self.dimention + direction:
            self.position_top += direction
    def check_hit(self, ball_coords: dict):
        if self.side == 'Left' or 'Right':
            ball_position = ball_coords.get('y')
        else:
            ball_position = ball_coords.get('x')
        if self.position_top <= ball_position <= self.position_bot:
            return (ball_position - self.position_center) / (self.size / 2)
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

        self.color = 1 # why?

    @property
    def position(self):
        return {'x': self._position_x, 'y': self._position_y}

    def paddle_hit(self, paddle: Paddle):
        paddle_hit = paddle.check_hit(self.position)
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
        # Init game maze
        self._screen_size = {'height': screen_height, 'width': screen_width}
        self._paddle_size = paddle_size
        # Init paddles
        self._player1: Paddle = Paddle('Left', self._screen_size.get('height'), self._paddle_size) # left player
        self._player2: Paddle = Paddle('Right', self._screen_size.get('width'), self._paddle_size) # right player
        # Init ball
        self._ball: Ball = Ball({'N': True, 'S': True, 'W': False, 'E': False}, self.screen_size) # Set walls to True

    def run_tick(self):
        self._ball.movement()

    def move_player1(self, direction: int):
        self._player1.move_paddle(direction)
    def move_player2(self, direction: int):
        self._player2.move_paddle(direction)

    def set_player1_ready(self):
        self._player1_ready = True
        if self._player2_ready:
            self.start()
    def set_player2_ready(self):
        self._player2_ready = True
        if self._player1_ready:
            self.start()

    def start(self):
        self.start_time = time.time() + 3

    def get_state(self):
        # Move ball
        if self.start_time == 0 and time.perf_counter() - self.last_tick > self._ball.speed:
            self.last_tick = time.perf_counter()
            self._ball.movement()
        # Send countdown
        if self.start_time !=0 and self.start_time - time.time() > 0:
            return {
                'game_id': self.game_id,
                'start_time': self.start_time - time.time(),
            }
        else:
            self.start_time = 0
        # Send game data
        ## Prepare data
        player_1 = self._player1
        player_2 = self._player2
        ball = self._ball
        data = {
            'game_id': self.game_id,
            'start_time': self.start_time,
            'player_1': {
                'side': player_1.side,
                'size': player_1.size,
                'top_position': player_1.position_top,
                'bot_position': player_1.position_bot
            },
            'player_2': {
                'side': player_2.side,
                'size': player_2.size,
                'top_position': player_2.position_top,
                'bot_position': player_2.position_bot
            },
            'ball': {
                'position': {'x': ball._position_x, 'y': ball._position_y},
            },
        }
        return data

    def get_init_data(self):
        data = {
            'maze': self._screen_size,
            'no_players': 2,
            'paddle_size': self._paddle_size
        }
