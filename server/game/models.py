from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from users.models import User
from .constants import MIN_SCORE, MAX_SCORE
from django.core.validators import MinValueValidator, MaxValueValidator

class Game(models.Model):
    player1 = models.ForeignKey(User, related_name='games_as_player1', on_delete=models.CASCADE)
    player2 = models.ForeignKey(User, related_name='games_as_player2', on_delete=models.CASCADE)
    score_player1 = models.IntegerField(
        MinValueValidator(MIN_SCORE),
        MaxValueValidator(MAX_SCORE),
        default=0
    )
    score_player2 = models.IntegerField(default=0)


    def __str__(self):
        return self
