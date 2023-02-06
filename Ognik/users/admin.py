from django.contrib import admin


# Register your models here.
from .models import Message, FriendList, FriendRequest, FriendRoom
admin.site.register(Message)
admin.site.register(FriendList)
admin.site.register(FriendRequest)
admin.site.register(FriendRoom)