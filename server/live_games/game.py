import random
import time
import asyncio

class Paddle:

    def __init__(self, side, map_height, paddle_height, paddle_speed):
        self._map_height = map_height
        self._paddle_height = paddle_height
        self._paddle_speed = paddle_speed
        self._side = side
        self._y_position = int(map_height / 2 - paddle_height / 2)
        self._direction = 0

    def move_paddle(self):
        new_y = self._y_position + (self._direction * self._paddle_speed)
        if new_y < 0:
            self._y_position = 0
        elif new_y > self._map_height - self._paddle_height:
            self._y_position = self._map_height - self._paddle_height
        else:
            self._y_position = new_y

    # im not using the hit position yet
    def check_hit(self, ball_y_position):
        if ball_y_position > self._y_position and ball_y_position < self._y_position + self._paddle_height:
            return ball_y_position - (self._y_position + (self._paddle_height / 2))
        else:
            None

class Ball:

    def __init__(self, map_width, map_height, ball_speed, paddle_width, ball_radius):
        self._map_width = map_width
        self._map_height = map_height
        self._start_x = int(map_width / 2) 
        self._start_y = int(map_height / 2)
        self._position_x = self._start_x
        self._position_y = self._start_y
        self._initial_spee = ball_speed
        self._speed = ball_speed
        self._ball_radius = ball_radius
        self._direction_x = random.choice([1, -1])
        self._direction_y = random.choice([1, -1])
        self._paddle_width = paddle_width

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
        if self._position_y <= 1 + self._ball_radius or self._position_y >= self._map_height - self._ball_radius:
            self._direction_y *= -1
        # Paddle collisions
        if self._position_x <= 1 + self._paddle_width + self._ball_radius:
            if left_paddle.check_hit(self._position_y) != None:
                self._direction_x *= -1
                self._speed += 0.5
            else:
                self.reset_ball_position_to_center()
                self._speed = self._initial_spee
                return 2
        elif self._position_x >= self._map_width - self._paddle_width - self._ball_radius:
            if right_paddle.check_hit(self._position_y) != None:
                self._direction_x *= -1
                self._speed += 0.5
            else:
                self.reset_ball_position_to_center()
                self._speed = self._initial_spee
                return 1
        return 0

class GameLogic:

    def __init__(self, game_id, player1_username, player2_username):

        self._game_id = game_id
        self._player1_username = player1_username
        self._player2_username = player2_username
        self._player1_score = 0
        self._player2_score = 0
        self._score_to_win = 5
        self._map_width = 1000
        self._map_height = 500 
        self._paddle_height = 50
        self._paddle_width = 5
        self._paddle_speed = 5
        self._ball_speed = 2
        self._ball_radius = 5
        self._initial_countdown_value = 3
        self._current_countdown = self._initial_countdown_value
        self._player1_ready = False
        self._player2_ready = False
        self._phase = "waitingToStart"
        self._start_time = -1
        self._last_tick = 0
        self._player1: Paddle = Paddle('Left', self._map_height, self._paddle_height, self._paddle_speed)
        self._player2: Paddle = Paddle('Right', self._map_height, self._paddle_height, self._paddle_speed)
        self._ball: Ball = Ball(self._map_width, self._map_height, self._ball_speed, self._ball_radius, self._paddle_width)

    def move_player1(self, direction: int):
        if direction != 1 and direction != -1 and direction != 0:
            print("Direction invalid: ", direction)
        else:
            self._player1._direction = direction

    def move_player2(self, direction: int):
        if direction != 1 and direction != -1 and direction != 0:
            print("Direction invalid: ", direction)
        else:
            self._player2._direction = direction

    def set_player1_ready(self):
        self._player1_ready = True
        if self._player2_ready:
            asyncio.create_task(self.render_game())

    def set_player2_ready(self):
        self._player2_ready = True
        if self._player1_ready:
            asyncio.create_task(self.render_game())

    async def render_game(self):
        while self._player1_score != self._score_to_win and self._player2_score != self._score_to_win:
            print("p1: ", self._player1_score, " p2:", self._player2_score)
            self._phase = "countdown"
            await self.render_countdown()
            self._phase = "running"
            player_scored = await self.render_ball_movement()
            if player_scored == 1:
                self._player1_score += 1
            elif player_scored == 2:
                self._player2_score += 1
        self._phase = "game_over"

    async def render_countdown(self):
        
        self._current_countdown = self._initial_countdown_value
        start_time = time.time() + self._initial_countdown_value

        while self._current_countdown > 0:
            new_countdown = start_time - time.time()
            if new_countdown > 0:
                self._current_countdown = new_countdown
            else:
                self._current_countdown = 0
            await asyncio.sleep(0.016) # 60 fps

    async def render_ball_movement(self):
        while self._phase == "running":
            self.move_paddles()
            player_scored = self._ball.movement(self._player1, self._player2)
            if player_scored != 0:
                print("player scored: ", player_scored)
                return player_scored
            await asyncio.sleep(0.016) # 60 fps

    def move_paddles(self):
        self._player1.move_paddle()
        self._player2.move_paddle()

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
            'player1_score': self._player1_score,
            'player2_score': self._player2_score,
        }
        return data

    def get_init_data(self):
        data = {
            'map_height': self._map_height,
            'map_width': self._map_width,
            'player1_username': self._player1_username,
            'player2_username': self._player2_username,
            'paddle_height': self._paddle_height,
            'paddle_width': self._paddle_width,
            'ball_radius': self._ball_radius
        }
        return data
