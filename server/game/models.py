from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from users.models import User
from .constants import MIN_SCORE, MAX_SCORE

class Game(models.Model):
    player1 = models.ForeignKey(User, related_name='games_as_player1', on_delete=models.CASCADE)
    player2 = models.ForeignKey(User, related_name='games_as_player2', on_delete=models.CASCADE)
    score_player1 = models.IntegerField(
        validators= [
			MinValueValidator(MIN_SCORE),
			MaxValueValidator(MAX_SCORE)
		],
        default=0
    )
    score_player2 = models.IntegerField(
        validators= [
			MinValueValidator(MIN_SCORE),
			MaxValueValidator(MAX_SCORE)
		],
        default=0
	)
    game_date = models.DateTimeField(auto_now_add=True)
    # boolean ?
    winner = models.BooleanField()

    def __str__(self):
        return f"Game (id {self.id}) between {self.player1.username} and {self.player2.username} on {self.game_date.strftime('%Y-%m-%d')}"
