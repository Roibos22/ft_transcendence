from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from .constants import MIN_SCORE, MAX_SCORE

class User(models.Model):
    username = models.CharField(max_length=50)
    full_name = models.CharField(max_length=50)
    #Online status
    status = models.BooleanField()
    #Avatar picture
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    #Friends list (symmetric?)
    friends = models.ManyToManyField('self', blank=True, symmetrical=True, related_name='friend_of')

    def __str__(self):
        return f"username: {self.username}\nfull name:{self.score}"

# class Score(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     score = models.IntegerField(
#         validators=[
#             MinValueValidator(MIN_SCORE),
#             MaxValueValidator(MAX_SCORE)
#         ],
#         default = 0
#     )
#     date_awarded = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"username: {self.user.username} score: {self.score}"

