from django.contrib import admin
from .models import User, CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_staff', 'is_active')
    search_fields = ('username', 'email')

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('user', 'online', 'avatar')
    search_fields = ('user__username', 'user__email')
# Non -default:
# @admin.register(User)
# class UserAdmin(admin.ModelAdmin):
#     pass

