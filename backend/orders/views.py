from .serializers import OrderDetailSerializer, OrderItemSerializer, OrderCreateSerializer
from rest_framework import viewsets
from .models import Order, OrderItem
from .services import OrderService
from .permissions import IsAdmin,IsAdminOrderItems
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from .tasks import send_order_email
from rest_framework.pagination import PageNumberPagination

class OrderPagination(PageNumberPagination):
  page_size = 5
  page_size_query_param = 'page_size' 
  max_page_size = 100


class OrderViewSet(viewsets.ModelViewSet):
  permission_classes = [IsAdmin]
  queryset = Order.objects.all()
  serializer_class = OrderDetailSerializer
  pagination_class = OrderPagination

  def get_queryset(self):
    user = self.request.user

    if not user.is_authenticated:
      return Order.objects.none()
    
    if user.role == "ADMIN":
      return Order.objects.all()
    
    if user.role == "CUSTOMER":
      return Order.objects.filter(customer=user, status = "CONFIRMED").distinct().order_by('-id')
    
    if user.role == "VENDOR":
      return Order.objects.filter(items__product__vendor=user).distinct()
    
    return Order.objects.none()
  
  def create(self, request, *args, **kwargs):
    serializer = OrderCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    try:
      order = OrderService.create_order(
        user=request.user,
        items_data=serializer.validated_data['items']
      )

      response_serializer = OrderDetailSerializer(order)
      return Response(response_serializer.data)
      
    except Exception as e:
      return Response({"error": str(e)})
  
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
  @transaction.atomic # Add this to ensure stock and order save together safely
  def checkout(self, request):
    try:
      order = Order.objects.get(customer=self.request.user, status="PENDING")
    except Order.DoesNotExist:
      return Response({"error": "No active cart found"}, status=400)
    
    order_items = OrderItem.objects.filter(order=order)
    
    if not order_items.exists():
      return Response({"error": "Your cart is empty"}, status=400)

    # 1. SAFETY CHECK: Ensure everything in the cart is still in stock!
    for item in order_items:
      if item.product.stock < item.quantity:
        return Response(
          {"error": f"Not enough stock for {item.product.name}. Only {item.product.stock} left."}, 
          status=400
        )
    
    # 2. DEDUCT STOCK: Now that we know it's safe, deduct the actual quantities
    for item in order_items:
      item.product.stock -= item.quantity
      item.product.save()

    # 3. CONFIRM ORDER
    order.status = "CONFIRMED"
    order.save()  
    
    return Response({"message": "Order placed successfully!"})
  
  @action(detail=False, methods=['delete'], url_path='cancel')
  def cancel(self, request):
    try:
      order = Order.objects.get(customer=self.request.user, status="PENDING")
    except Order.DoesNotExist:
      return Response({"error": "No active cart found"}, status=400)
    
    orderItems = OrderItem.objects.filter(order=order)
    
    # REMOVED the stock returning logic here. 
    # Since we didn't deduct stock when they put items in the cart, 
    # we don't need to return it when they empty the cart!
    
    orderItems.delete()
    order.delete() 
    
    return Response({"message": "Cart emptied successfully!"})

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