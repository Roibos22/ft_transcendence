from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import User, TwoFactorCode
from .serializer import *
from .utils import *
from django_otp.plugins.otp_totp.models import TOTPDevice

from .permissions import Is2FAComplete

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
        user = serializer.save()
        data = clean_response_data(serializer.data)
        generate_otp(user=user)
        send_email_confirmation(user=user)
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

        # Check if the user has a confirmed TOTP device (2FA enabled)
        totp_device = TOTPDevice.objects.filter(user=user).first()

        # 2FA activated
        if totp_device:
            generate_otp(user=user)
            send_email_code(user=user)
            return Response({
            'detail': '2FA required',
            '2fa_required': True,
            'tokens': tokens  # Temporary JWT token
            }, status=status.HTTP_200_OK)
        # 2FA NOT activated
        tokens = get_tokens_for_user(user=user, two_factor_complete=True)
        return Response({
            'detail': 'Login successful',
            'tokens': tokens
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@debug_request
@api_view(['GET'])
def verify_email(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    otp_token = request.GET.get('token', None)
    if not otp_token:
        return Response({'error': 'Token is not provided'}, status=status.HTTP_400_NOT_FOUND)

    sys_otp_codes = TwoFactorCode.objects.filter(user=user)
    if not sys_otp_codes:
        return Response({'detail': '2FA not set up for this user'}, status=status.HTTP_400_BAD_REQUEST)

    for sys_otp_code in sys_otp_codes:
        if sys_otp_code.verify_code(otp_token):
            # If verification succeeds, delete the used sys_otp_code
            sys_otp_code.delete()
            user.email_isverified = True
            user.save()
            return Response({
                'detail': 'Email confirmed',
            }, status=status.HTTP_200_OK)
    sys_otp_codes.delete()
    return Response({'detail': 'Login failed'}, status=status.HTTP_400_BAD_REQUEST)


# Authentication required

@debug_request
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_2fa(request):
    user = request.user
    otp_token = request.data.get('otp')

    # Retrieve the user's confirmed TOTP device
    totp_device = TOTPDevice.objects.filter(user=user).first()
    # Retrieve the user's confirmed email
    # sys_otp_code = TwoFactorCode.objects.filter(user=user).first()

    if not totp_device:
        return Response({'detail': '2FA not set up for this user'}, status=status.HTTP_400_BAD_REQUEST)

    if totp_device.verify_token(otp_token):
        # Mark the device as confirmed
        totp_device.confirmed = True
        totp_device.save()
        return Response({'detail': '2FA device successful'}, status=status.HTTP_200_OK)
    # Delete totp_device?
    return Response({'detail': '2FA wrong OTP'}, status=status.HTTP_400_BAD_REQUEST)

@debug_request
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def confirm_2fa(request):
    user = request.user
    otp_token = request.data.get('otp')

    # Retrieve the user's confirmed TOTP device
    totp_device = TOTPDevice.objects.filter(user=user).first()
    # Retrieve the user's confirmed email
    sys_otp_codes = TwoFactorCode.objects.filter(user=user)

    if not totp_device and not sys_otp_codes:
        return Response({'detail': '2FA not set up for this user'}, status=status.HTTP_400_BAD_REQUEST)

    if totp_device and totp_device.verify_token(otp_token):
        # If TOTP verification succeeds
        tokens = get_tokens_for_user(user=user, two_factor_complete=True)
        return Response({
            'detail': 'Login successful',
            'tokens': tokens
        }, status=status.HTTP_200_OK)
    for sys_otp_code in sys_otp_codes:
        if sys_otp_code.verify_code(otp_token):
            # If verification succeeds, delete the used sys_otp_code
            sys_otp_code.delete()
            tokens = get_tokens_for_user(user=user, two_factor_complete=True)
            return Response({
                'detail': 'Login successful',
                'tokens': tokens
            }, status=status.HTTP_200_OK)
    sys_otp_codes.delete()
    return Response({'detail': 'Login failed'}, status=status.HTTP_400_BAD_REQUEST)

# 2FA required

@debug_request
@api_view(['GET'])
@permission_classes([Is2FAComplete])
def setup_2fa(request):
    user = request.user

    # Create a new TOTP device if one doesn't already exist
    totp_device, created = TOTPDevice.objects.get_or_create(user=user, confirmed=False)

    # Generate a QR code URL for the user to scan in their TOTP app
    qr_url = totp_device.config_url

    # Optionally, generate a QR Code image and serve it
    # img = qrcode.make(qr_url)
    # img.save('/path/to/qr_code.png')  # Save the QR code somewhere

    return Response({'qr_code_url': qr_url}, status=status.HTTP_200_OK)

@debug_request
@api_view(['PATCH'])
@permission_classes([Is2FAComplete])
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
@permission_classes([Is2FAComplete])
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
@permission_classes([Is2FAComplete])
def user_profile(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = UserSerializer(user)
    if request.user != user:
        data = clean_response_data(serializer.data, ['password', 'user_permissions', 'email', 'username', 'phone_number'])
    else:
        data = clean_response_data(serializer.data)
    return Response(data)
