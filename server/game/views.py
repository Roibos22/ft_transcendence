from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import LocalGame, Game
from .serializer import GameSerializer, LocalGameSerializer 
from django.views import View
from django.http import JsonResponse
from django.contrib.auth import authenticate
from users.permissions import Is2FAComplete

@api_view(['GET'])
def get_games(request):
    games = Game.objects.all()
    serializer = GameSerializer(games, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_game(request):
    serializer = GameSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def game_profile(requst, game_id):
    try:
        game = Game.objects.get(id=game_id)
    except Game.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    serilizer = GameSerializer(game)
    return Response(serilizer.data)

@api_view(['POST'])
@permission_classes([Is2FAComplete])
def create_local_game(request):
    user = request.user
    game = LocalGame.objects.create(created_by=user)
    return Response({'game_id': game.id}, status=status.HTTP_201_CREATED)

