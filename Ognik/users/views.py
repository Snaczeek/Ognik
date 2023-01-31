from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import MessageSerializer
from .models import MessageTest

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
def getMessages(request):
    user = request.user
    messages = user.messagetest_set.all()
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)