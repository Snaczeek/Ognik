from django.urls import path
from . import views
from .views import MyTokenObtainPairView

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('', views.getRoutes),
    path('messages/<str:username>', views.getMessages),
    path('friends/', views.getFriendList),
    path('rooms/<str:friendName>', views.getRoomMessages),
    path('rooms/send/<str:friendName>', views.sendMessage),
    path('friendrequest/getUsers/<str:username>', views.getUser),
    path('friendrequest/getFriendRequest', views.getFriendRequest),
    path('friendrequest/sendFriendRequest/<str:friendName>', views.createFriendRequest),
    path('friendrequest/acceptFriendRequest/<str:friendName>', views.acceptFriendRequest),
    path('friendrequest/declineFriendRequest/<str:friendName>', views.declineFriendRequest),

    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]