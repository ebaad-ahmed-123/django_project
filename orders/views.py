from .serializers import OrderSerializer, OrderItemSerializer
from rest_framework import viewsets
from .models import Order, OrderItem
from .services import OrderService
from .permissions import IsAdmin,IsAdminOrderItems
from rest_framework.decorators import action
from rest_framework.response import Response
from .tasks import send_order_email


class OrderViewSet(viewsets.ModelViewSet):
  permission_classes = [IsAdmin]
  queryset = Order.objects.all()
  serializer_class = OrderSerializer

  def get_queryset(self):
    user = self.request.user
    if not user.is_authenticated:
      return Order.objects.none()
    if user.role == "ADMIN":
      return Order.objects.all()
    if user.role == "CUSTOMER":
      return Order.objects.filter(customer=user, status = "CONFIRMED")
    if user.role == "VENDOR":
      return Order.objects.filter(items__product__vendor=user).distinct()
    return Order.objects.none()
  def list(self, request, *args, **kwargs):

    if request.user.role == "VENDOR":
      total_orders = Order.objects.filter(
        items__product__vendor=request.user
      ).distinct().count()
      return Response({
        "total_orders": total_orders
      })
    return super().list(request, *args, **kwargs)

  def perform_create(self, serializer):
    serializer.save(customer=self.request.user)

      
  
  @action(detail=False, methods=['post'], url_path='checkout')
  def checkout(self, request):
    order = Order.objects.get(customer=self.request.user, status="PENDING")
    if order.status != "PENDING":
      return Response({"error": "Order already processed"}, status=400)
    order.status = "CONFIRMED"
    order.save()  
    send_order_email.delay(request.user.email) 
    return Response({"message": "Order placed successfully!"})
  
  @action(detail=False, methods=['delete'], url_path='cancel')
  def cancel(self, request):
    order = Order.objects.get(customer=self.request.user, status="PENDING")
    orderItems = OrderItem.objects.filter(order = order)
    for item in orderItems:
      product = item.product
      qty = item.quantity
      product.stock += qty
      product.save()
    
    orderItems.delete()
    order.delete() 
    return Response({"message": "Order deleted successfully!"})

class OrderItemViewSet(viewsets.ModelViewSet):
  permission_classes = [IsAdminOrderItems]
  queryset = OrderItem.objects.all()
  serializer_class = OrderItemSerializer

  def get_queryset(self):
    user = self.request.user
    if not user.is_authenticated:
      return OrderItem.objects.none()
    if user.role == "ADMIN":
      return OrderItem.objects.all()
    if user.role == "CUSTOMER":
      return OrderItem.objects.filter(order__customer=user, order__status="PENDING")
    
  def perform_create(self, serializer):
    OrderService.create_order_item(
      user=self.request.user,
      validated_data=serializer.validated_data
    )