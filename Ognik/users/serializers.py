from rest_framework.serializers import ModelSerializer 
from rest_framework import serializers 
from .models import Message, FriendList, FriendRoom, FriendRequest
from django.contrib.auth.models import User

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "id"]


class MessageSerializer(ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Message
        fields = '__all__'

class FriendListSerialiazer(ModelSerializer):
    friends = UserSerializer(many = True)
    class Meta:
        model = FriendList
        fields = ["user", "friends"]

class FriendRoomSerialiazer(ModelSerializer):
    users = UserSerializer(many = True)
    class Meta:
        model = FriendRoom
        fields = "__all__"

class FriendRoomSerialiazerForConsume(ModelSerializer):
    class Meta:
        model = FriendRoom
        fields = ["name"]

class FriendRequestSerialiazer(ModelSerializer):
    sender = UserSerializer()
    receiver = UserSerializer()
    class Meta:
        model = FriendRequest
        fields = "__all__"