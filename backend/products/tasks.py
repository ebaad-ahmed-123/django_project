# products/tasks.py
from celery import shared_task
from faker import Faker
import faker_commerce  
from .models import Product
from django.contrib.auth import get_user_model
import random

User = get_user_model()

fake = Faker()
fake.add_provider(faker_commerce.Provider) 

@shared_task
def generate_fake_products():
  vendors = list(User.objects.filter(role="VENDOR"))
  
  if not vendors:
    return "Task Aborted: No vendors exist in the database."

  products_to_create = []

  for _ in range(10):
    product = Product(
      name=fake.ecommerce_name(),
      price=round(random.uniform(5.00, 999.99), 2),
      stock=random.randint(10, 500),
      vendor=random.choice(vendors)
    )
    products_to_create.append(product)

  Product.objects.bulk_create(products_to_create)

  return f"Successfully generated 10 fake products."