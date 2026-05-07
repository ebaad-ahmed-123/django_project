from django.core.exceptions import ValidationError
from .models import Product

class ProductService:
  @staticmethod
  def create_product(user,validated_data):
    if user.role != "VENDOR":
      raise ValidationError("User must be Vendor")
    return Product.objects.create(
      vendor=user,
      **validated_data
    ) 