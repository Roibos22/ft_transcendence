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

# def get_tokens_for_user(user, two_factor_complete=False):
#     refresh = RefreshToken.for_user(user)
#     refresh['2fa_complete'] = two_factor_complete  # Add custom claim for 2FA status
#     return {
#         'refresh': str(refresh),
#         'access': str(refresh.access_token),
# }

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

