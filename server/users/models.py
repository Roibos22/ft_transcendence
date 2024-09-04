from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.validators import UnicodeUsernameValidator

class User(AbstractUser):
    username = models.CharField(
        max_length=15,
        unique=True,
        db_index=True,
        validators=[UnicodeUsernameValidator()],
        help_text='Required. 15 characters or fewer. Letters, digits and @/./+/-/_ only.',
        error_messages={
            'unique': "A user with that username already exists.",
        }
    )
    display_name = models.CharField(max_length=15, blank=True)
    #Online status
    online = models.BooleanField(default=False)
    #Avatar picture
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    #Friends list (symmetric?)
    friends = models.ManyToManyField('self', blank=True, symmetrical=False, related_name='friend_of')
    def save(self, *args, **kwargs):
        if not self.display_name:
            self.display_name = self.username
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username}'s profile"
