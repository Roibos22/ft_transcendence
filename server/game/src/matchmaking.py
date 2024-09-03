from collections import deque

class Matchmaker:
    def __init__(self):
        self.queue = deque()

    def add_to_queue(self, user):
        self.queue.append(user)
        return self.check_for_match()

    def check_for_match(self):
        if len(self.queue) >= 2:
            user1 = self.queue.popleft()
            user2 = self.queue.popleft()
            game_id = self.create_game(user1, user2)
            return game_id
        return None

    def create_game(self, user1, user2):
        # Generate a unique game ID (use UUID, for example)
        import uuid
        game_id = str(uuid.uuid4())
        # Here, you could also save the game state in the database
        # Example: Game.objects.create(player1=user1, player2=user2, game_id=game_id)
        return game_id

matchmaker = Matchmaker()