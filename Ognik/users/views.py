from django.http import JsonResponse, HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from django.middleware import csrf

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import AccessToken

from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password

from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from django.shortcuts import get_object_or_404

from .serializers import MessageSerializer, FriendListSerialiazer, FriendRoomSerialiazer, UserSerializer, FriendRequestSerialiazer, FileSerializer
from .models import FriendRoom, Message, FriendRequest, File, FriendList
from django.db.models import QuerySet

from django.core.exceptions import ObjectDoesNotExist, ValidationError

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


def test(request):
    return HttpResponse("Its working")

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

@api_view(['POST'])
@csrf_exempt
def registerUser(request):
    username = request.data["username"]
    password = request.data["password"]
    email = request.data["email"]

    if len(username) > 15:
        return JsonResponse({'error': 'Username is too long'})

    # Checking if value are not empty
    if not username or not password or not email:
            return JsonResponse({'error': 'Invalid request'})
    
    if User.objects.filter(username=username).exists():
            print("Username already exists")
            return JsonResponse({'error': 'Username already exists'})
    
    # Creating user model object
    new_user = User(
        username=username,
        email=email,
        password=make_password(password)
    )
    new_user.save()

    # Creating list model for user
    print(new_user.id)
    user_flist = FriendList(user = new_user)
    user_flist.save()

    return JsonResponse({'success': 'User registered successfully'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getFriendList(request):
    user = request.user
    friends = user.friendlist_set.all()
    serializer = FriendListSerialiazer(friends, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getRoomMessages(request, friendName, count, date, mode = 1):
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

    # mode 3: getting messages older than date sorted from oldest to newest
    # mode 2: getting newer messages than date
    # mode 1: getting newset messages based on count sorted from oldest to newest 
    
    if mode == 3:
        rooms_messages = reversed(Message.objects.filter(room__id__in = rooms).filter(created__lt = date).order_by("-created")[:count])
    elif mode == 2:
        rooms_messages = reversed(Message.objects.filter(room__id__in = rooms).filter(created__gt = date).order_by("-created")[:count])
    elif mode == 1:
        rooms_messages = reversed(Message.objects.filter(room__id__in = rooms).order_by("-created")[:count])

    
    # serializer = FriendRoomSerialiazer(rooms, many=True) ~~ debuging stuff
    # Serialazing all messages into json format
    m_serializer = MessageSerializer(rooms_messages, many=True)
    # Returnig all data
    return Response(m_serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sendMessage(request, friendName):
    # user = authenticate(username="Snaczek", password="qwerty1@3")
    user = request.user
    try:
        friend_object = User.objects.get(username=friendName)
    except Exception:
        return HttpResponse("user doesn't exist")
    
    try:
        rooms = FriendRoom.objects.filter(users__id = user.id).filter(users__id = friend_object.id).get()
    except Exception:
        return HttpResponse("Room doesn't exist")
    
    message = Message(user = user, room = rooms, body = request.data)
    message.save()
    return HttpResponse("it did work")

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def uploadFile(request, friendName):
    user = request.user
    # Validate request data
    serializer = FileSerializer(data = request.data)
    if not serializer.is_valid():
        return JsonResponse(serializer.errors, status=400)
    
    try:
        friend_object = User.objects.get(username=friendName)
    except User.DoesNotExist:
        return JsonResponse({"error": "User doesn't exist"}, status = 404)
    
    try:
        rooms = FriendRoom.objects.filter(users__id = user.id).filter(users__id = friend_object.id).get()
    except FriendRoom.DoesNotExist:
        return JsonResponse({"error": "Chat room doesn't exist"}, status = 404)
    
    # Creating file object in Database
    file = File(user = user, room = rooms, file = request.FILES['file'], fileName = request.FILES['file'])
    
    try:
        file.clean() # Enforcing file size limit (It should be never call, unless file serializer fails)
        file.save()
    except ValidationError as e:
        return JsonResponse({"error" : str(e)}, status = 400)
    # Creating message object that contains file refrence
    message = Message(user = user, room = rooms, body = "empty", file = file, isIncludeFile = True)
    message.save()
    

    return HttpResponse("it did work")

@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def downloadFile(request, file_id, token):
    # Getting file object
    file = get_object_or_404(File, id=file_id)

    # Checking if file exist in storage
    if not file.isFileExists():
        return HttpResponse("File doesn't exist")
    # Getting user object based on AccesToken 
    try:
        access_token_obj = AccessToken(token)
    except Exception:
        return HttpResponse("Acces Denied")
    user_id = access_token_obj['user_id']
    user = User.objects.get(id=user_id)
    # Getting all rooms that user is in
    users_rooms = FriendRoom.objects.filter(users__id = user.id)

    # Checks if user has acces to specific file (based on if file was sent in user's chatroom)
    if file.room in users_rooms:
        # Build the response with the file data
        response = HttpResponse(file.file, content_type='application/octet-stream')
        response['Content-Disposition'] = f'attachment; filename="{file.file.name}"'
        return response
    else:
        return HttpResponse("Acces Denied")

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCsrfToken(request):
    csrf_token = csrf.get_token(request)
    return JsonResponse({'csrfToken': csrf_token})

@api_view(['GET'])
def getUser(request, username):
    user = request.user
    # Getting queryset of serched users (based on username param) excluding requesting user's account
    user_list = User.objects.filter(username__icontains=username).exclude(id=user.id)

    # Serialaizing queryset into json formt
    serialiazer = UserSerializer(user_list, many=True)
    return Response(serialiazer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def createFriendRequest(request, friendName):
    friend = User.objects.get(username=friendName)
    response = {}
    response['type'] = "friendRequest"

    try:
        sender = FriendRequest.objects.get(sender__id = request.user.id, receiver__id = friend.id)
    except Exception:
        sender = FriendRequest.objects.filter(sender__id = request.user.id).filter(receiver__id = friend.id)
    try:
        receiver = FriendRequest.objects.get(sender__id = friend.id,receiver__id = request.user.id)
    except Exception:
        receiver = FriendRequest.objects.filter(sender__id = request.user.id).filter(receiver__id = friend.id)
    # If friendRequest already exist
    if sender or receiver:
        if not isinstance(sender, QuerySet):
            if sender.is_active == True:
                print("exist")
                response['status'] = "already exist"
                return Response(response)
            else:
                sender.is_active = True
                sender.save()
                print("re sent request")
                response['status'] = "re sent request"
                return Response(response)
            
        if not isinstance(receiver, QuerySet):
            if receiver.is_active == True:
                print("exist")
                response['status'] = "already exist"
                return Response(response)
            else:
                receiver.is_active = True
                receiver.save()
                print("re sent request")
                response['status'] = "re sent request"

    friendRequest = FriendRequest(sender = request.user, receiver = friend)
    friendRequest.save()
    
    response['status'] = "sended"
    return Response(response)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def acceptFriendRequest(request, friendName):
    
    # Getting friend object
    friend = User.objects.get(username=friendName)

    # Getting friendRequest object and accepting it
    friendRequest = FriendRequest.objects.get(sender__id = friend.id, receiver__id = request.user.id)
    friendRequest.accept()

    # Checking if chatroom already exist between those users
    try:
        room = FriendRoom.objects.filter(users__id = request.user.id).filter(users__id = friend.id).get()
    except Exception:
        room = None
    
    if not room:
        # Creating Chatroom between users 
        friendroom = FriendRoom.objects.create(name=f"{request.user.username}_{friend.username}") 
        friendroom.users.add(friend)
        friendroom.users.add(request.user)
    
    return HttpResponse("wotk")

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def declineFriendRequest(request, friendName):
    friend = User.objects.get(username=friendName)
    friendRequest = FriendRequest.objects.get(sender__id = friend.id, receiver__id = request.user.id)
    friendRequest.is_active = False
    friendRequest.save()
    print("wokrk")
    return HttpResponse("worky")

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getFriendRequest(requst):
    friendRequst = FriendRequest.objects.filter(receiver__id = requst.user.id).exclude(is_active = False)
    serializer = FriendRequestSerialiazer(friendRequst, many = True)

    return Response(serializer.data)