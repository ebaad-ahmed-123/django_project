# conftest.py
import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()

@pytest.fixture
def api_client():
  return APIClient()

@pytest.fixture
def vendor_user(db): # 'db' tells pytest this needs database access
  return User.objects.create_user(
    username="test_vendor",
    name="Test Vendor",
    email="vendor@test.com",
    password="testpassword123",
    role="VENDOR"
  )

@pytest.fixture
def customer_user(db):
  return User.objects.create_user(
    username="test_customer",
    name="Test Customer",
    email="customer@test.com",
    password="testpassword123",
    role="CUSTOMER"
  )