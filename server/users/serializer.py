from rest_framework import serializers
from .models import User, Score

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
