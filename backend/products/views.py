from django.shortcuts import render
from .serializers import ProductSerializer
from rest_framework import viewsets, filters
from .models import Product
from .permissions import IsVendor
from .services import ProductService
from rest_framework.pagination import PageNumberPagination

class ProductPagination(PageNumberPagination):
  page_size = 5
  page_size_query_param = 'page_size' 
  max_page_size = 100

class ProductViewSet(viewsets.ModelViewSet):
  permission_classes = [IsVendor]
  queryset = Product.objects.all()
  serializer_class = ProductSerializer
  pagination_class = ProductPagination

  filter_backends = [filters.SearchFilter]
  search_fields = ['name']

  def get_queryset(self):
    user = self.request.user
    
    if user.is_authenticated and user.role == 'VENDOR':
      return Product.objects.filter(vendor=user)
    
    return Product.objects.filter(is_active=True)

  # def perform_create(self, serializer):
  #   serializer.save(vendor = self.request.user)

  def perform_create(self, serializer):
    ProductService.create_product(
      user=self.request.user,
      validated_data=serializer.validated_data
    )
    

  

  

