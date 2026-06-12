from .models import Order, OrderItem
from rest_framework import serializers
from products.serializers import ProductSerializer
from products.models import Product 

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), 
        source='product', 
        write_only=True
    )

    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'product', 'product_id', 'quantity']
        read_only_fields = ['order']

class OrderCreateSerializer(serializers.Serializer):
  items = OrderItemSerializer(many=True)

class OrderDetailSerializer(serializers.ModelSerializer):
  items = OrderItemSerializer(many=True, read_only=True)

  class Meta:
    model = Order
    fields = ['id', 'status', 'items']