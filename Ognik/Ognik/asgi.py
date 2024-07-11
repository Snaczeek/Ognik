"""
ASGI config for Ognik project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/howto/deployment/asgi/
"""

import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Ognik.settings')
d = get_asgi_application()

from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from django.urls import path, re_path
from .channelsmiddleware import JwtAuthMiddlewareStack
import users.routing

# django.setup()

application = ProtocolTypeRouter(
    {
        "http": d,
        "websocket": AllowedHostsOriginValidator(
            JwtAuthMiddlewareStack(
                URLRouter(
                    users.routing.websocket_urlpatterns
                )
            ),
        ),
    }
)