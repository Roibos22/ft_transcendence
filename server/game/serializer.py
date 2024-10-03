from rest_framework import serializers
from .models import Game, LocalGame

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = '__all__'


class LocalGameSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocalGame
        fields = '__all__'
