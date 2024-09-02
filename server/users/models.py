from django.db import models
from django.contrib.auth.models import User

class User(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    #Online status
    status = models.BooleanField()
    #Avatar picture
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    #Friends list (symmetric?)
    friends = models.ManyToManyField('self', blank=True, symmetrical=True, related_name='friend_of')

    def __str__(self):
        return f"{self.user.username}'s profile"
