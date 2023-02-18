from .consumers import ChatConsumer
from django.urls import path, re_path

websocket_urlpatterns = [
    # re_path(r'ws/socket-server/(?P<friendName>\w+)$', ChatConsumer.as_asgi()),
    re_path(r'ws/socket-server/', ChatConsumer.as_asgi()),
]
