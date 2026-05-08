from django.db import models

class Order(models.Model):
  PENDING = 'PENDING'
  CONFIRMED = 'CONFIRMED'
  
  STATUS_CHOICES = [
      (PENDING, 'Pending'),
      (CONFIRMED, 'Confirmed'),
  ]

  customer = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='orders')
  status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=PENDING,)
  
  class Meta:
      indexes = [
        models.Index(fields=['status']),
        models.Index(fields=['customer', 'status'])
      ]

class OrderItem(models.Model):
  order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
  product = models.ForeignKey('products.Product', on_delete=models.CASCADE)
  quantity = models.PositiveIntegerField(default=1)