import curses
import time

# Desired terminal size (width, height)
REQUIRED_WIDTH = 100
REQUIRED_HEIGHT = 50

PADDLE_HEIGHT = 4
DELAY = 0.05

def check_terminal_size(stdscr):
    # Get current terminal size
    max_y, max_x = stdscr.getmaxyx()

    # Check if terminal is at the required size
    if max_y != REQUIRED_HEIGHT or max_x != REQUIRED_WIDTH:
        # If not, display a message and wait for resizing
        stdscr.clear()
        stdscr.addstr(0, 0, f"Please resize your terminal to {REQUIRED_WIDTH}x{REQUIRED_HEIGHT}.")
        stdscr.refresh()

        # Wait for the user to resize the terminal
        while max_y != REQUIRED_HEIGHT or max_x != REQUIRED_WIDTH:
            max_y, max_x = stdscr.getmaxyx()
            stdscr.clear()
            stdscr.addstr(0, 0, f"Current size: {max_x}x{max_y}. Please resize your terminal to {REQUIRED_WIDTH}x{REQUIRED_HEIGHT}.")
            stdscr.refresh()

def draw_paddle(screen, paddle_y, x):
    for i in range(PADDLE_HEIGHT):
        screen.addch(paddle_y + i, x, '|')
        if x == REQUIRED_WIDTH - 1:
            screen.addch(paddle_y + i, x - 1, '|')
        else:
            screen.addch(paddle_y + i, x + 1, '|')

def draw_ball(screen, ball_y, ball_x):
    if 0 <= ball_y <= REQUIRED_HEIGHT - 1 and 0 <= ball_x <= REQUIRED_WIDTH - 1:
        screen.addch(ball_y, ball_x, 'O')

def move_paddle(paddle_y, max_y, direction):
    if 0 <= paddle_y + direction <= max_y - PADDLE_HEIGHT:
        paddle_y += direction
    return paddle_y

def game(stdscr):
    curses.curs_set(0)
    stdscr.nodelay(1)
    stdscr.timeout(100)

    check_terminal_size(stdscr)

    max_y, max_x = REQUIRED_HEIGHT, REQUIRED_WIDTH

    left_paddle_y = max_y // 2 - PADDLE_HEIGHT // 2
    right_paddle_y = max_y // 2 - PADDLE_HEIGHT // 2

    ball_y, ball_x = max_y // 2, max_x // 2
    ball_dir_y, ball_dir_x = 1, 1

    while True:
        stdscr.clear()

        # Draw paddles
        draw_paddle(stdscr, left_paddle_y, 1)
        draw_paddle(stdscr, right_paddle_y, max_x - 2)

        # Draw ball
        draw_ball(stdscr, ball_y, ball_x)

        # Move ball
        ball_y += ball_dir_y
        ball_x += ball_dir_x

        # Ball bounce
        if ball_y <= 0 or ball_y >= max_y - 1:
            ball_dir_y *= -1
        if ball_x == 2 and left_paddle_y <= ball_y < left_paddle_y + PADDLE_HEIGHT:
            ball_dir_x *= -1
        if ball_x == max_x - 3 and right_paddle_y <= ball_y < right_paddle_y + PADDLE_HEIGHT:
            ball_dir_x *= -1

        # Input handling
        key = stdscr.getch()
        if key == ord('w'):
            left_paddle_y = move_paddle(left_paddle_y, max_y, -1)
        elif key == ord('s'):
            left_paddle_y = move_paddle(left_paddle_y, max_y, 1)
        elif key == curses.KEY_UP:
            right_paddle_y = move_paddle(right_paddle_y, max_y, -1)
        elif key == curses.KEY_DOWN:
            right_paddle_y = move_paddle(right_paddle_y, max_y, 1)

        stdscr.refresh()
        time.sleep(DELAY)

curses.wrapper(game)
