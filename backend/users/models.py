from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):

  name = models.CharField(max_length=100)
  email = models.EmailField(unique=True)

  USERNAME_FIELD = 'email'
  REQUIRED_FIELDS = []

  ADMIN = 'ADMIN'
  VENDOR = 'VENDOR'
  CUSTOMER = 'CUSTOMER'

  ROLE_CHOICES = [
      (ADMIN, 'Admin'),
      (VENDOR, 'Vendor'),
      (CUSTOMER, 'Customer'),
  ]
  role = models.CharField( max_length=10, choices=ROLE_CHOICES, default=CUSTOMER)
  