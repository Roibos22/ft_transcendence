from rest_framework.permissions import BasePermission

class Is2FAComplete(BasePermission):
    """
    Custom permission to check if the user has completed 2FA.
    Only allows access if 2fa_complete is True in the JWT.
    """
    def has_permission(self, request, view):
        # First, check if the user is authenticated
        if not request.user or not request.user.is_authenticated:
            return False

        # Check if '2fa_complete' claim exists in the JWT and is True
        if '2fa_complete' in request.auth and request.auth['2fa_complete'] is True:
            return True

        return False  # Deny access if 2FA is not complete
