from rest_framework.serializers import ModelSerializer 
from .models import MessageTest

class MessageSerializer(ModelSerializer):
    class Meta:
        model = MessageTest
        fields = '__all__'

