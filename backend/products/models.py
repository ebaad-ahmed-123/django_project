from django.db import models

class Product(models.Model):
  name = models.CharField(max_length=100)
  price = models.DecimalField(max_digits=10,decimal_places=2)
  stock = models.PositiveIntegerField(default=1)
  vendor = models.ForeignKey('users.User',on_delete=models.CASCADE,related_name='products')
  is_active = models.BooleanField(default=True)
  
  class Meta:
    ordering = ['-id']
    indexes = [
      models.Index(fields=['name']),
      models.Index(fields=['is_active'])
    ]
