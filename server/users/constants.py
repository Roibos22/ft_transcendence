import os

EMAIL_VERIFICATION_LINK='https://' + os.getenv('IP_ADDRESS') + ':8443/api/users/emailverification/'
TWOFA_VERIFICATION_LINK='https://' + os.getenv('IP_ADDRESS') + ':8443/api/users/2fa/verify/'

