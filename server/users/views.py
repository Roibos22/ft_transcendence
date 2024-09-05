from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializer import *
from .utils import clean_response_data, debug_request
from django_otp.plugins.otp_totp.models import TOTPDevice
from rest_framework_simplejwt.tokens import RefreshToken

# No authentication required

@debug_request
@api_view(['GET'])
def get_users(request):
    users = User.objects.all()

    users = users.filter(is_active=True)
    serializer = UserSerializer(users, many=True)
    data = clean_response_data(serializer.data)
    return Response(data)

@debug_request
@api_view(['POST'])
def create_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        data = clean_response_data(serializer.data)
        return Response(data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@debug_request
@api_view(['POST'])
def user_login(request):
    try:
        serializer = CustomTokenObtainPairSerializer(data=request.data)
    except serializers.ValidationError as e:
        return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)
    if serializer.is_valid():
        # Define user
        user = serializer.user
        # JWT tokens
        tokens = serializer.validated_data
        refresh = RefreshToken.for_user(user)
        # 2FA is not yet complete
        refresh['2fa_complete'] = False

        # 2FA
        # Check if the user has a confirmed TOTP device (2FA enabled)
        totp_device = TOTPDevice.objects.filter(user=user, confirmed=True).first()

        # 2FA activated
        if totp_device:
            return Response({
            'detail': '2FA required',
            '2fa_required': True,
            'tokens': tokens  # Temporary JWT token
        }, status=status.HTTP_200_OK)
        # No 2FA activated
        refresh['2fa_complete'] = True
        return Response({
            'detail': 'Login successful',
            'tokens': tokens
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Authentication required

@debug_request
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
        data = clean_response_data(serializer.data)
        return Response(data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@debug_request
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    if request.user != user:
        return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    serializer = UserSerializer(user, data={'is_active': False}, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@debug_request
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = UserSerializer(user)
    if request.user != user:
        data = clean_response_data(serializer.data, ['password', 'user_permissions', 'email', 'username'])
    else:
        data = clean_response_data(serializer.data)
    return Response(data)

