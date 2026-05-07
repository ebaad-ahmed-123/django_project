from django.urls import path,include
from .views import UserViewSet,RegisterView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'', UserViewSet)

urlpatterns = [
   path('api/register/', RegisterView.as_view()),
  path('api/login/', TokenObtainPairView.as_view()),
  path('api/refresh/', TokenRefreshView.as_view()),
  path('api/', include(router.urls)),
]