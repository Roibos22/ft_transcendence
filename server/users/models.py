from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)

class User(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    #Online status
    online = models.BooleanField(default=False)
    #Avatar picture
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    #Friends list (symmetric?)
    friends = models.ManyToManyField('self', blank=True, symmetrical=False, related_name='friend_of')

    def __str__(self):
        return f"{self.user.username}'s profile"
