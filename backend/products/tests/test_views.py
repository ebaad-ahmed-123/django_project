import pytest
from products.models import Product
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
def test_get_product_list(api_client, vendor_user):
  
  Product.objects.create(
    name="Cup",
    price=10.99,
    stock=50,
    vendor=vendor_user
  )

  response = api_client.get('/products/api/')

  assert response.status_code == 200
  assert response.data['count'] == 1  
  assert len(response.data['results']) == 1 
  assert response.data['results'][0]['name'] == "Cup"


@pytest.mark.django_db
def test_vendor_can_create_product(api_client, vendor_user):
  api_client.force_authenticate(user=vendor_user)

  payload = {
    "name": "Leather Wallet",
    "price": "45.00",
    "stock": 20
  }
  response = api_client.post('/products/api/', data=payload, format='json')

  assert response.status_code == 201 
  saved_product = Product.objects.get(name="Leather Wallet")
  assert saved_product.vendor == vendor_user

@pytest.mark.django_db
def test_unauthenticated_user_cannot_create_product(api_client):
    
  payload = {
    "name": "Hacker Item",
    "price": "1.00",
    "stock": 999
  }

  response = api_client.post('/products/api/', data=payload, format='json')

  assert response.status_code == 401 
  assert Product.objects.count() == 0

@pytest.mark.django_db
def test_cannot_create_product_with_negative_price(api_client, vendor_user):
  api_client.force_authenticate(user=vendor_user)

  payload = {
    "name": "Wallet",
    "price": "-50.00", 
    "stock": 10
  }

  response = api_client.post('/products/api/', data=payload, format='json')

  assert response.status_code == 400
  assert "price" in response.data 
  assert Product.objects.count() == 0
