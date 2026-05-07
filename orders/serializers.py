from .models import Order, OrderItem
from rest_framework import serializers
from .services import OrderService

class OrderItemSerializer(serializers.ModelSerializer):
  class Meta:
    model = OrderItem
    fields = ['id', 'order', 'product', 'quantity']
    read_only_fields = ['order']

class OrderSerializer(serializers.ModelSerializer):
  items = OrderItemSerializer(many=True)

  class Meta:
    model = Order
    fields = ['status','items']
  
  def create(self,validated_data):
    items_data = validated_data.pop('items')
    return OrderService.create_order(
      user=self.context['request'].user, 
      items_data=items_data
    )
