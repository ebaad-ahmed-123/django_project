import pytest
from products.models import Product
from django.contrib.auth import get_user_model
from products.tasks import generate_fake_products

User = get_user_model()

@pytest.mark.django_db
def test_generate_fake_products_task(vendor_user):
    
  result = generate_fake_products()

  assert result == "Successfully generated 10 fake products."
  assert Product.objects.count() == 10