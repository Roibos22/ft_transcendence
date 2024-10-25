from rest_framework_simplejwt.tokens import RefreshToken
from .models import TwoFactorCode
from django.core.mail import send_mail
from .constants import TWOFA_VERIFICATION_LINK, EMAIL_VERIFICATION_LINK
from django.conf import settings
import random

def clean_response_data(data, keys_to_remove=["password"]):
    """
    Removes specified keys from the serialized data.

    :param data: List or dict of serialized data
    :param keys_to_remove: List of keys to remove from the data
    :return: Cleaned data
    """
    if isinstance(data, list):
        for item in data:
            for key in keys_to_remove:
                item.pop(key, None)
    else:
        for key in keys_to_remove:
            data.pop(key, None)
    return data

def get_tokens_for_user(user, two_factor_complete=False):
    refresh = RefreshToken.for_user(user)
    refresh['2fa_complete'] = two_factor_complete  # Add custom claim for 2FA status
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

def generate_otp(user):
    # Create a random 6-digit code
    otp_code = random.randint(100000, 999999)

    # Store the OTP in the database
    TwoFactorCode.objects.create(user=user, code=str(otp_code))

    return otp_code

# def send_sms_code(user):

#     otp_code = TwoFactorCode.objects.filter(user=user).first().code
#     # Twilio setup
#     client = Client('TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN')
#     message = client.messages.create(
#         body=f'Your verification code is {otp_code}',
#         from_='+1234567890',  # Twilio phone number
#         to=user.phone_number
#     )

def send_email_code(user):
    if not user.email_verified:
        return
    two_factor = TwoFactorCode.objects.filter(user=user).first()
    otp_code = two_factor.code
    send_mail(
        'Your Verification Code',
        f'Your verification code is {otp_code}',
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )

def send_email_verification_link_via_mail(user):
    two_factor = TwoFactorCode.objects.filter(user=user).first()
    otp_code = two_factor.code
    send_mail(
        'Email Verification',
        f'Press here to verify your email: {EMAIL_VERIFICATION_LINK}{user.username}/?token={otp_code}',
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )

def send_2fa_verification_link_via_mail(user):
    two_factor = TwoFactorCode.objects.filter(user=user).first()
    otp_code = two_factor.code
    send_mail(
        '2fa Verification',
        f'Press here to complete 2fa setup: {TWOFA_VERIFICATION_LINK}{user.username}/?token={otp_code}',
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )

# Debugging tools
import functools
import logging

logger = logging.getLogger(__name__)

def debug_request(func):
    """Decorator to debug print request data and method."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        request = args[0]  # The first argument is always the request
        logger.debug(f"Request Method: {request.method}")
        if hasattr(request, 'data') and request.data:
            logger.debug(f"Request Data: {request.data}")
        return func(*args, **kwargs)
    return wrapper

