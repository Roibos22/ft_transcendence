from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.validators import UnicodeUsernameValidator
import time

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
    # Email verification flag
    email_isverified = models.BooleanField(default=False)
    # Phone number for authentication
    phone_number = models.CharField(blank=True, null=True)
    # Changable display name
    display_name = models.CharField(max_length=15, blank=True)
    # Online status
    online = models.BooleanField(default=False)
    # Avatar picture
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    # Friends list (symmetric?)
    friends = models.ManyToManyField('self', blank=True, symmetrical=False, related_name='friend_of')
    def save(self, *args, **kwargs):
        if not self.display_name:
            self.display_name = self.username
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username}'s profile"

class TwoFactorCode (models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=6, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        # Check if the code is still valid (e.g., only valid for 5 minutes)
        return (time.time() - self.timestamp.timestamp()) < 300  # 5 minutes

    def verify_code(self, token):
        if not self.is_valid():
            return False
        if self.code == token:
            return True
        return False
