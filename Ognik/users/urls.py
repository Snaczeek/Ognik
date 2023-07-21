from django.urls import path
from . import views
from .views import MyTokenObtainPairView

from django.conf import settings
from django.conf.urls.static import static



from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('', views.getRoutes),
    path('test', views.test),
    path('register', views.registerUser),
    path('messages/<str:username>', views.getMessages),
    path('friends/', views.getFriendList),
    path('rooms/<str:friendName>/<int:count>/<str:date>/<int:mode>', views.getRoomMessages),
    path('rooms/send/<str:friendName>', views.sendMessage),
    path('rooms/sendfile/<str:friendName>', views.uploadFile),
    path('rooms/download/<int:file_id>/<str:token>', views.downloadFile),
    path('get-csrf-token', views.getCsrfToken),
    path('friendrequest/getUsers/<str:username>', views.getUser),
    path('friendrequest/getFriendRequest', views.getFriendRequest),
    path('friendrequest/sendFriendRequest/<str:friendName>', views.createFriendRequest),
    path('friendrequest/acceptFriendRequest/<str:friendName>', views.acceptFriendRequest),
    path('friendrequest/declineFriendRequest/<str:friendName>', views.declineFriendRequest),

    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)