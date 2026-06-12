import pytest
from products.models import Product
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
def test_create_product_successfully():
    
  test_vendor = User.objects.create_user(
    name="vendor_bob", 
    email="bob@gmail.com",
    username="bob@gmail.com",
    password="testpassword123",
    role="VENDOR"
  )
  
  product = Product.objects.create(
    name="cup",
    price=15.99,
    stock=100,
    vendor=test_vendor
  )
  
  assert product.name == "cup"
  assert product.price == 15.99
  assert product.stock == 100
  assert product.vendor.email == "bob@gmail.com"

  assert Product.objects.count() == 1