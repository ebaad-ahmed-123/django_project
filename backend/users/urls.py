from django.urls import path,include
from .views import UserViewSet,RegisterView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter
from .serializers import CustomTokenObtainPairSerializer

router = DefaultRouter()
router.register(r'', UserViewSet)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

urlpatterns = [
  path('api/register/', RegisterView.as_view()),
  path('api/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
  path('api/refresh/', TokenRefreshView.as_view()),
  path('api/', include(router.urls)),
]