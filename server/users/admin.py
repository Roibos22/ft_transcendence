from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('online', 'avatar', 'username', 'email', 'is_staff', 'is_active')
    search_fields = ('username', 'email')
# Non -default:
# @admin.register(User)
# class UserAdmin(admin.ModelAdmin):
#     pass
