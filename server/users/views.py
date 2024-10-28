from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import FileResponse
from rest_framework import status
from .models import User, TwoFactorCode
from .serializer import *
from .utils import *
from django_otp.plugins.otp_totp.models import TOTPDevice

from .permissions import Is2FAComplete

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
        user = serializer.save()
        data = clean_response_data(serializer.data)
        generate_otp(user=user)
        # send_email_verification_link_via_mail(user=user)
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

        # Check if email is verified
        # if not user.email_verified:
        #     return Response({
        #         'detail': 'Email is not verified. Please check you inbox and verify your email to proceed.',
        #         'email_verified': False
        #     }, status=status.HTTP_403_FORBIDDEN)

        # Check if 2fa is required
        if user.twoFA_active:
            generate_otp(user=user)
            send_email_code(user)
            return Response({
                'username': user.username,
                'detail': '2FA required, one time password sent to users email',
                '2fa_required': True,
                'tokens': tokens
            }, status=status.HTTP_200_OK)

        # 2FA NOT activated
        tokens = get_tokens_for_user(user=user, two_factor_complete=True)
        return Response({
            'username': user.username,
            'detail': 'Login successful',
            '2fa_required': False,
            'tokens': tokens
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@debug_request
@api_view(['GET'])
def verify_email(request, username: str):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    otp_token = request.GET.get('token', None)
    if not otp_token:
        return Response({'error': 'Token is not provided'}, status=status.HTTP_400_NOT_FOUND)

    sys_otp_codes = TwoFactorCode.objects.filter(user=user)
    if not sys_otp_codes:
        return Response({'detail': 'No one time password found in database for this user.'}, status=status.HTTP_400_BAD_REQUEST)

    for sys_otp_code in sys_otp_codes:
        if otp_token == sys_otp_code.code:
            sys_otp_code.delete()
            user.email_verified = True
            user.save()
            return Response({
                'detail': 'Email confirmed',
            }, status=status.HTTP_200_OK)

    sys_otp_codes.delete()

    return Response({'detail': 'Login failed'}, status=status.HTTP_400_BAD_REQUEST)

@debug_request
# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
@api_view(['GET'])
def verify_2fa(request, username: str):
    try:
        user: User = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    otp_token = request.GET.get('token', None)
    if not otp_token:
        return Response({'error': 'Token is not provided'}, status=status.HTTP_400_NOT_FOUND)

    sys_otp_codes = TwoFactorCode.objects.filter(user=user)
    if not sys_otp_codes:
        return Response({'detail': 'No one time password found in database for this user.'}, status=status.HTTP_400_BAD_REQUEST)

    for sys_otp_code in sys_otp_codes:
        if otp_token == sys_otp_code.code:
            sys_otp_code.delete()
            user.twoFA_active = True
            user.save()
            print(f"2FA activated for user {user.id}: {user.twoFA_active}")
            return Response({
                'detail': '2fa verified',
            }, status=status.HTTP_200_OK)

    sys_otp_codes.delete()
    print(user)
    return Response({'detail': '2FA wrong OTP'}, status=status.HTTP_400_BAD_REQUEST)

@debug_request
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def confirm_2fa(request):
    user: User = request.user
    otp_token = request.data.get('otp')

    if not otp_token:
        return Response({'error': 'Token is not provided'}, status=status.HTTP_400_NOT_FOUND)

    sys_otp_codes = TwoFactorCode.objects.filter(user=user)
    if not sys_otp_codes:
        return Response({'detail': 'No one time password found in database for this user.'}, status=status.HTTP_400_BAD_REQUEST)

    for sys_otp_code in sys_otp_codes:
        if otp_token == sys_otp_code.code:
            sys_otp_codes.delete()
            tokens = get_tokens_for_user(user=user, two_factor_complete=True)
            return Response({
                'username': user.username,
                'detail': 'Login successful',
                'tokens': tokens
            }, status=status.HTTP_200_OK)

    return Response({'detail': 'Login failed, one time password incorrect'}, status=status.HTTP_400_BAD_REQUEST)

# 2FA required

# to-do Shouldnt this be isAuthenticated?
@debug_request
@api_view(['GET'])
@permission_classes([Is2FAComplete])
def setup_2fa(request):
    user = request.user
    generate_otp(user=user)
    send_2fa_verification_link_via_mail(user=user)
    return Response({
        'detail': 'Verification link has been sent to your email. Please press it to complete 2FA setup.',
    }, status=status.HTTP_200_OK)

@debug_request
@api_view(['PATCH'])
@permission_classes([Is2FAComplete])
def update_user(request, username: str):
    try:
        user = User.objects.get(username=username)
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
@permission_classes([Is2FAComplete])
def delete_user(request, username: str):
    user = request.user
    if (username != user.username):
        return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    user.delete()
    # return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    return Response({'message': 'User deleted successfully'}, status=status.HTTP_200_OK)


@debug_request
@api_view(['GET'])
@permission_classes([Is2FAComplete])
def user_profile(request, username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = UserSerializer(user)
    if request.user != user:
        data = clean_response_data(serializer.data, ['password', 'user_permissions', 'email', 'username', 'phone_number'])
    else:
        data = clean_response_data(serializer.data)
    return Response(data)

@debug_request
@api_view(['GET'])
@permission_classes([Is2FAComplete])
def user_avatar(request, username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    if user.avatar:
        image_url = user.avatar.url
        image_extension = image_url.rsplit('.', 1)[-1]
    return FileResponse(open(ASSETS_ROOT + image_path, 'rb'), content_type=f'image/{image_extension}')

