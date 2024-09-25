import random
import time

class Paddle:
    def __init__(self, side, map_height, paddle_size):
        self._map_height = map_height
        self._paddle_size = paddle_size
        self._side = side
        self._y_position = int(map_height / 2 - paddle_size / 2)

    def move_paddle(self, direction: int):
        if direction < 0 and self._y_position + direction > 0:
            self._y_position += direction
        elif direction > 0 and self._y_position + direction < self._map_height - self._paddle_size:
            self._y_position += direction

    def check_hit(self, ball_y_position):
        if ball_y_position > self._y_position and ball_y_position < self._y_position + self._paddle_size:
            return ball_y_position - (self._y_position + (self._paddle_size / 2))
        else:
            None

class Ball:

    def __init__(self, start_x, start_y, map_width, map_height, ball_speed):
        self._position_x = start_x
        self._position_y = start_y
        self._map_width = map_width
        self._map_height = map_height
        self._speed = ball_speed
        self._direction_x = random.choice([1, -1])
        self._direction_y = random.choice([1, -1])


    # CONTINUE HERE

    @property
    def position(self):
        return {'x': self._position_x, 'y': self._position_y}

    def paddle_hit(self, paddle: Paddle):
        if paddle == None:
            return
        paddle_hit = paddle.check_hit(self.position)
        if paddle_hit != None:
            self._direction_x *= -1
        if paddle_hit > 0 and self._direction_y <= 0:
            self._direction_y *= -1
        elif paddle_hit < 0 and self._direction_y >= 0:
            self._direction_y *= -1


    def movement(self, left_paddle, right_paddle):
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
        elif not self.right and self._position_x == self._screen_size.get('width') - 2:
            self.paddle_hit(right_paddle)
        elif not self.top and self._position_y == 1:
            self.paddle_hit(top_paddle)
        elif not self.bot and self._position_y == self._screen_size.get('height') - 2:
            self.paddle_hit(bottom_paddle)

class GameLogic:
    def __init__(self, game_id):

        self._game_id
        self._map_width = 100
        self._map_height = 50 
        self._paddle_size = 4
        self._ball_speed = 1
        self._countdown = 3
        self._player1_ready = False
        self._player2_ready = False
        self._phase = "Waiting players"
        self._start_time = -1
        self._last_tick = 0
        self._player1: Paddle = Paddle('Left', self._map_height, self._paddle_size)
        self._player2: Paddle = Paddle('Right', self._map_height, self._paddle_size)

        self._ball: Ball = Ball({'N': True, 'S': True, 'W': False, 'E': False}, self._screen_size)

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
        self._start_time = time.time() + self._countdown
        self._phase = "countdown"

    def update_countdown(self):
        new_countdown = self._start_time - time.time()
        if new_countdown > 0:
            self._countdown = new_countdown
        else:
            self._countdown = 0
            self.phase = "running"

    def get_state(self):

        if self._countdown > 0:
            self.update_countdown()

        data = {
            'game_id': self._game_id,
            'phase': self._phase,
            'player1': self._player1._y_position,
            'player2': self._player2._y_position,
            'player1_ready': self._player1_ready,
            'player2_ready': self._player2_ready,
            'ball': self._ball.position,
            'countdown': self._start_time,
        }

        return data

    def get_init_data(self, player_no):
        data = {
            'maze': self._screen_size,
            'no_players': 2,
            'paddle_size': self._paddle_size,
            'player_no': player_no
        }
        return data
