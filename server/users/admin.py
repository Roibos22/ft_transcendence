from django.contrib import admin
from .models import User

admin.site.register(User)



# Non -default:
# @admin.register(User)
# class UserAdmin(admin.ModelAdmin):
#     pass

