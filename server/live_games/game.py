import random
import time
import asyncio

class Paddle:
    def __init__(self, side, map_height, paddle_size):
        self._map_height = map_height
        self._paddle_size = paddle_size
        self._side = side
        self._y_position = int(map_height / 2 - paddle_size / 2)
        self._direction = 0

    def move_paddle(self, direction: int):
        self._direction = direction
        if direction < 0 and self._y_position + direction > 0:
            self._y_position += direction
        elif direction > 0 and self._y_position + direction < self._map_height - self._paddle_size:
            self._y_position += direction

    # im not using the hit position yet
    def check_hit(self, ball_y_position):
        if ball_y_position > self._y_position and ball_y_position < self._y_position + self._paddle_size:
            return ball_y_position - (self._y_position + (self._paddle_size / 2))
        else:
            None

class Ball:

    def __init__(self, map_width, map_height, ball_speed):
        self._map_width = map_width
        self._map_height = map_height
        self._start_x = int(map_width / 2) 
        self._start_y = int(map_height / 2)
        self._position_x = self._start_x
        self._position_y = self._start_y
        self._speed = ball_speed
        self._direction_x = random.choice([1, -1])
        self._direction_y = random.choice([1, -1])

    @property
    def position(self):
        return {'x': self._position_x, 'y': self._position_y}

    @property
    def direction(self):
        return {'x': self._direction_x, 'y': self._direction_y}

    def reset_ball_position_to_center(self):
        self._position_x = self._start_x
        self._position_y = self._start_y

    def movement(self, left_paddle: Paddle, right_paddle: Paddle):
        self._position_x += self._direction_x * self._speed
        self._position_y += self._direction_y * self._speed
        # Wall collisions
        if self._position_y <= 1 or self._position_y >= self._map_height:
            self._direction_y *= -1
        # Paddle collisions
        if self._position_x <= 1:
            if left_paddle.check_hit(self._position_y) != None:
                self._direction_x *= -1
            else:
                self.reset_ball_position_to_center()
        if self._position_x >= self._map_width:
            if right_paddle.check_hit(self._position_y) != None:
                self._direction_x *= -1
            else:
                self.reset_ball_position_to_center()

class GameLogic:
    def __init__(self, game_id, player1_username, player2_username):

        self._game_id = game_id
        self._player1_username = player1_username
        self._player2_username = player2_username
        self._map_width = 1000
        self._map_height = 500 
        self._paddle_size = 20
        self._ball_speed = 1
        self._initial_countdown_value = 3
        self._current_countdown = self._initial_countdown_value
        self._player1_ready = False
        self._player2_ready = False
        self._phase = "waitingToStart"
        self._start_time = -1
        self._last_tick = 0
        self._player1: Paddle = Paddle('Left', self._map_height, self._paddle_size)
        self._player2: Paddle = Paddle('Right', self._map_height, self._paddle_size)
        self._ball: Ball = Ball(self._map_width, self._map_height, self._ball_speed)

    def move_player1(self, direction: int):
        self._player1.move_paddle(direction)

    def move_player2(self, direction: int):
        self._player2.move_paddle(direction)

    def set_player1_ready(self):
        self._player1_ready = True
        if self._player2_ready:
            asyncio.create_task(self.render_game())

    def set_player2_ready(self):
        self._player2_ready = True
        if self._player1_ready:
            asyncio.create_task(self.render_game())

    async def render_game(self):
        self._start_time = time.time() + self._initial_countdown_value
        self._phase = "countdown"
        await self.render_countdown()
        self._phase = "running"
        await self.render_ball_movement()

    async def render_countdown(self):
        while self._current_countdown > 0:
            new_countdown = self._start_time - time.time()
            if new_countdown > 0:
                self._current_countdown = new_countdown
            else:
                self._current_countdown = 0
            await asyncio.sleep(0.016) # 60 fps

    async def render_ball_movement(self):
        while self._phase == "running":
            self._ball.movement(self._player1, self._player2)
            await asyncio.sleep(0.016) # 60 fps

    def get_state(self):
        data = {
            'game_id': self._game_id,
            'phase': self._phase,
            'player1_pos': self._player1._y_position,
            'player2_pos': self._player2._y_position,
            'player1_dir': self._player1._direction,
            'player2_dir': self._player2._direction,
            'player1_ready': self._player1_ready,
            'player2_ready': self._player2_ready,
            'ball': self._ball.position,
            'ball_dir': self._ball.direction,
            'countdown': self._current_countdown,
        }
        return data

    def get_init_data(self):
        data = {
            'map_height': self._map_height,
            'map_width': self._map_width,
            'player1_username': self._player1_username,
            'player2_username': self._player2_username,
            'paddle_height': self._paddle_size
        }
        return data
