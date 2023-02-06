from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models import Q 

# Create your models here.
class FriendList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    friends = models.ManyToManyField(User, blank=True, related_name="friends")

    def __str__(self):
        return self.user.username
    
    def add_friend(self, account):
        if not account in self.friends.all():
            self.friends.add(account)
    
    def remove_friend(self, account):
        if account in self.friends.all():
            self.friends.remove(account)
    
    def unfriend(self, removee):
        # Initiate the action of unfriending someone
        remover_friends_list = self # person terminating the friendship

        # Remove friend from remover friend list
        remover_friends_list.remove_friend(removee)

        # Remove friend from removee friend list
        friends_list = FriendList.objects.get(user = removee)
        friends_list.remove_friend(self.user)
    
    def is_mutual_friend(self, friend):
        # is this a friend?
        if friend in self.friends.all():
            return True
        else:
            return False

class FriendRequest(models.Model):
    """
    A friend request consist of two main parts:
        1. SENDER:
            - Person sending/initiating friend request
        2. RECEIVER:
            - Person receiving the friend request
    """
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sender")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="receiver")

    is_active = models.BooleanField(blank=True, null=False, default=True)

    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.sender.username
    
    def accept(self):
        """
        Accept a friend request
        Update both SENDER and RECEIVER friend lists
        """
        receiver_friend_list = FriendList.objects.get(user=self.receiver)
        if receiver_friend_list:
            receiver_friend_list.add_friend(self.sender)
            sender_friend_list = FriendList.objects.get(user = self.sender)
            if sender_friend_list:
                sender_friend_list.add_friend(self.receiver)
                self.is_active = False
                self.save()
    
    def decline(self):
        """
        Decline a friend request
        It is "declined" by setting the 'is_active' field to false
        """
        self.is_active = False
        self.save()
    
    def cancel(self):
        """
        Cancel a friend request
        """
        self.is_active = False
        self.save()

class FriendRoom(models.Model):
    # Referencing users participating in the room
    users = models.ManyToManyField(User, related_name='users')
    # Room's name
    name = models.TextField()

    # Utils function that returns room with contained passed users id's
    def ReturnCorrectRoom(user, friendName):  
        room = FriendRoom.objects.filter(users__id = user).filter(users__id = friendName) # returns every room with user id, then in those filtred rooms, returns only room with friendName id
        return room



class Message(models.Model):
    # Fields 
    # Referencing user which message belongs to
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # Referencing room in which message was created
    room = models.ForeignKey(FriendRoom, on_delete=models.CASCADE)
    # Message body and timestamp
    body = models.TextField(max_length=4000)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)