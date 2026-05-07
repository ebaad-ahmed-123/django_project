from django.urls import path,include
from .views import OrderViewSet,OrderItemViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'orders', OrderViewSet)
router.register(r'order-items', OrderItemViewSet)

urlpatterns = [
  path('api/', include(router.urls)),
]