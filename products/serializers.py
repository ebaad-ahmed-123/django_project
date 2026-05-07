from .models import Product
from rest_framework import serializers

class ProductSerializer(serializers.ModelSerializer):
  class Meta:
    model = Product
    fields = ['name','price','stock']
  def validate_price(self,value):
    if value < 0:
      raise serializers.ValidationError("Price cannot be negative")
    return value  
  def validate_stock(self,value):
    if value < 0:
      raise serializers.ValidationError("Stock cannot be negative")
    return value