from rest_framework.serializers import ModelSerializer 
from rest_framework import serializers 
from .models import Message, FriendList, FriendRoom, FriendRequest, File
from django.contrib.auth.models import User

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "id"]

class FileSerializer(ModelSerializer):
    fileSize = serializers.SerializerMethodField()
    
    class Meta:
        model = File
        fields = ["id", "fileName", "created", "file", "fileSize"]
    
    def get_fileSize(self, obj):
        return obj.file.size

    def validate_file(self, value):
        if value.size > 8 * 1024 * 1024: # 8 MB limit
            raise serializers.ValidationError("File size must be less than 8 MB")
        return value

class MessageSerializer(ModelSerializer):
    user = UserSerializer()
    file = FileSerializer()
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