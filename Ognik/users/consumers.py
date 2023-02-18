import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from .models import FriendRoom

from .serializers import FriendRoomSerialiazerForConsume

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.user = self.scope["user"]
        
        # Getting all rooms that contains user
        rooms = FriendRoom.objects.filter(users__id = self.user.id)
        # And then serializing data to JSON format
        serializer = FriendRoomSerialiazerForConsume(rooms, many=True)
        
        # creating channel for every chatroom that user is in 
        y = 0
        for _ in serializer.data:
            # debuging stuff
            # print(serializer.data[y].get('name'))

            # Setting group name based on chatroom name
            self.room_group_name = serializer.data[y].get('name')
            
            # Adding group to user channel
            async_to_sync(self.channel_layer.group_add)(
                self.room_group_name,
                self.channel_name
            )
            y = 1 + y
        
        self.accept()
        

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        # debbuging stuff:
        # self.send(text_data=json.dumps({
        #     'type': 'chat',
        #     'message': text_data_json,
        # }))
        # print(text_data_json['friendName'])
        # print(self.scope["user"].username)

        # Getting friend object
        # (Getting correct chatroom requires user id and friend id)
        try:
            friend_object = User.objects.get(username=text_data_json['friendName'])
        except Exception:
            # if friend_object was not found
            # assigned to friend_object account with no friends and no messages
            # so that django wont throw any errors and function returns only user's messages
            friend_object = authenticate(username="no_friends_object", password="qwerty1@3")
        
        # Getting correct room based on friend and user account
        rooms = FriendRoom.ReturnCorrectRoom(self.scope["user"].id, friend_object.id)
        print(rooms[0].name)
        async_to_sync(self.channel_layer.group_send)(
            # Sending message to correct group based on chatroom name
            rooms[0].name,
            {
                'type': 'chat_update',
                'message': 'chat has been updated',
                'chatroom': rooms[0].name,
                'friend': self.scope["user"].username
            }
        )
    
    def chat_update(self, event):
        message = event['message']
        chatroom = event['chatroom']
        friend = event['friend']

        self.send(text_data=json.dumps({
            'type':'chat_update',
            'message':message,
            'chatroom': chatroom,
            'friend': friend
        }))

    def disconnect(self, code):
        # async_to_sync(self.channel_layer.group_discard)(
        #     self.room_group_name,
        #     self.channel_name
        # )
        ...