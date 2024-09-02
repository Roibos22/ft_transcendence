from rest_framework import serializers
from django.contrib.auth.models import User as DjangoUser
from .models import User

class DjangoUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = DjangoUser
        fields = '__all__'
        extra_kwargs = {
            'username': {'read_only': True},  # Make username read-only
        }
    def create(self, validated_data):
        user = DjangoUser.objects.create_user(**validated_data)
        return user

class UserSerializer(serializers.ModelSerializer):
    user = DjangoUserSerializer()
    class Meta:
        model = User
        fields = '__all__'

    def create(self, validated_data):
        # Extract DjangoUser data from validated_data
        django_user_data = validated_data.pop('user')

        # Create DjangoUser instance
        django_user_serializer = DjangoUserSerializer.create(DjangoUserSerializer(), validated_data=django_user_data)

        # Create User instance, assuming `User` model has a `OneToOneField` or similar relation to `DjangoUser`
        user = User.objects.create(django_user=django_user_serializer, **validated_data)

        return user

    def update(self, instance, validated_data):
        # Extract DjangoUser data from validated_data
        django_user_data = validated_data.pop('user')

        # Update DjangoUser instance
        if django_user_data:
            django_user_serializer = DjangoUserSerializer(instance=instance.user, data=django_user_data, partial=True)
            if django_user_serializer.is_valid(raise_exception=True):
                django_user_serializer.save()

        # Update User instance fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Update User instance
        instance.save()
        return instance
