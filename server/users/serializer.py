from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import User
from game.serializer import GameSerializer

class UserSerializer(serializers.ModelSerializer):
    friends = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.all(), required=False)
    games = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = '__all__'

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        user.is_staff = False
        user.avatar = '/avatars/default_avatar.png'
        return user

    def update(self, instance, validated_data):
        # Extract CustomUser data from validated_data
        # if not instance.active:
        #     raise serializers.ValidationError("User is inactive and cannot be updated.")
        try:
            # change password
            password = validated_data.pop('password', None)
            if password:
                instance.set_password(password)
            # change avatar
            avatar = validated_data.get('avatar', None)
            if avatar:
                # Delete the old avatar
                if instance.avatar:
                    instance.avatar.delete(save=False)
                instance.avatar = avatar
        except KeyError:
            pass

        # Update other User instance fields
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

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        # Check if the user is active
        # if not self.user.active:
        #     raise serializers.ValidationError({"error": "User account is inactive."})

        # Call the base class's validate method
        data = super().validate(attrs)

        return data
