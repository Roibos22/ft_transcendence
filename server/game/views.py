from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Game
from .serializer import GameSerializer 
from django.views import View
from django.http import JsonResponse
from django.contrib.auth import authenticate
from .src.matchmaking import matchmaker

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

@api_view(['POST'])
def join_game(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)
    if user is not None:
        game_id = matchmaker.add_to_queue(user)
        if game_id:
            return Response({'status': 'matched', 'game_id': game_id})
        else:
            return Response({'status': 'waiting'})
    else:
        return Response({'status': 'error', 'message': 'Invalid credentials'}, status=401)

