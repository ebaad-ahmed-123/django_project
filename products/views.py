from django.shortcuts import render
from .serializers import ProductSerializer
from rest_framework import viewsets
from .models import Product
from .permissions import IsVendor
from .services import ProductService

class ProductViewSet(viewsets.ModelViewSet):
  permission_classes = [IsVendor]
  queryset = Product.objects.all()
  serializer_class = ProductSerializer

  def get_queryset(self):
    user = self.request.user
    
    if not user.is_authenticated:
      return Product.objects.none()
    
    if user.role == 'VENDOR':
      return Product.objects.filter(vendor=user)
    
    return Product.objects.all()

  # def perform_create(self, serializer):
  #   serializer.save(vendor = self.request.user)

  def perform_create(self, serializer):
    ProductService.create_product(
      user=self.request.user,
      validated_data=serializer.validated_data
    )
    

  

  

