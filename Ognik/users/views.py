from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from django.shortcuts import get_object_or_404

from .serializers import MessageSerializer, FriendListSerialiazer, FriendRoomSerialiazer
from .models import FriendRoom, Message
from django.db.models import Q

from django.core.exceptions import ObjectDoesNotExist

# Custom encryptions settings for token
# https://django-rest-framework-simplejwt.readthedocs.io/en/latest/customizing_token_claims.html
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# sending routes to fronted for auth token
@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/users/token',
        '/users/token/refresh',
    ]
    return Response(routes)

# sending specific user's messages that are serialized in json format
# user must be authenticated
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMessages(request, username):
    user = request.user
    # user = authenticate(username="admin", password="qwe1@3")
    messages = user.message_set.all()
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getFriendList(request):
    user = request.user
    friends = user.friendlist_set.all()
    serializer = FriendListSerialiazer(friends, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getRoomMessages(request, friendName):
    # user = authenticate(username="Snaczek", password="qwerty1@3") ~~ debuging stuff
    user = request.user
    try:
        friend_object = User.objects.get(username=friendName)
    except Exception:
        # if friend_object was not found
        # assigned to friend_object account with no friends and no messages
        # so that django wont throw any errors and function returns only user's messages
        friend_object = authenticate(username="no_friends_object", password="qwerty1@3")
    # Getting correct room based on friend and user account
    rooms = FriendRoom.ReturnCorrectRoom(user.id, friend_object.id)
    # Getting all messages from that room
    rooms_messages = Message.objects.filter(room__id__in = rooms).order_by("created")
    
    # serializer = FriendRoomSerialiazer(rooms, many=True) ~~ debuging stuff
    # Serialazing all messages into json format
    m_serializer = MessageSerializer(rooms_messages, many=True)
    # Returnig all data
    return Response(m_serializer.data)
