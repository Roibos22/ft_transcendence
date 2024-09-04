from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import redirect
from .models import User
from .serializer import *

@api_view(['GET'])
def get_users(request):
    users = User.objects.all()
    keys_to_remove = ['password']

    users = users.filter(is_active=True)
    serializer = UserSerializer(users, many=True)
    data = serializer.data
    for user in data:
        for key in keys_to_remove:
            user.pop(key, None)
    return Response(serializer.data)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    if request.user != user:
        return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    if not request.data:
        return Response({'error': 'Empty body'}, status=status.HTTP_400_BAD_REQUEST)
    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def create_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = UserSerializer(user, data={'is_active': False}, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def user_profile(request, user_id):
    keys_to_remove = ['password']
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = UserSerializer(user)
    data = serializer.data
    if request.user != user:
        keys_to_remove.extend(['user_permissions', 'email', 'username'])
    for key in keys_to_remove:
        data.pop(key, None)
    return Response(data)

@api_view(['POST'])
def custom_token_obtain_pair(request):
    serializer = CustomTokenObtainPairSerializer(data=request.data)
    try:
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except serializers.ValidationError as e:
        return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)
