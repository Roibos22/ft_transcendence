from rest_framework import serializers
# from django.contrib.auth.models import User as CustomUser
from .models import User, CustomUser
from game.models import Game
from game.serializer import GameSerializer

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'
        # extra_kwargs = {
        #     "username": {'read_only': True},
        # }
    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

class UserSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()
    friends = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.all(), required=False)
    games = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = '__all__'

    def create(self, validated_data):
        # Extract CustomUser data from validated_data
        custom_user_data = validated_data.pop('user')
        print("Debugging custom_user_data:", custom_user_data)
        # Create CustomUser instance
        custom_user_serializer = CustomUserSerializer(data=custom_user_data)
        custom_user_serializer.is_valid(raise_exception=True)
        custom_user_instance = custom_user_serializer.save()
        # Create User instance, assuming `User` model has a `OneToOneField` or similar relation to `CustomUser`
        user = User.objects.create(user=custom_user_instance, **validated_data)

        return user

    def update(self, instance, validated_data):
        # Extract CustomUser data from validated_data
        custom_user_data = validated_data.pop('user')

        # Update CustomUser instance
        if custom_user_data:
            custom_user_serializer = CustomUserSerializer(instance=instance.user, data=custom_user_data, partial=True)
            if custom_user_serializer.is_valid(raise_exception=True):
                custom_user_serializer.save()

        # Update User instance fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Update User instance
        instance.save()
        return instance
    def get_games(self, user):
        # Retrieve games for this user
        games = user.games_as_player1.all() | user.games_as_player2.all()
        serializer = GameSerializer(games, many=True)
        return serializer.data
