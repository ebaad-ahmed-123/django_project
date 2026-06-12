import pytest
from orders.models import Order, OrderItem
from products.models import Product
from django.db.models import ProtectedError

@pytest.mark.django_db
def test_create_order_and_items(customer_user, vendor_user):
 
  product = Product.objects.create(
    name="Test Laptop", 
    price=999.99, 
    stock=10, 
    vendor=vendor_user
  )

  order = Order.objects.create(customer=customer_user)
  
  item = OrderItem.objects.create(
    order=order,
    product=product,
    quantity=2
  )

  assert order.status == Order.PENDING  
  assert order.customer == customer_user

  assert order.items.count() == 1
  assert order.items.first().product.name == "Test Laptop"
  assert order.items.first().quantity == 2

@pytest.mark.django_db
def test_order_item_cascades_on_order_delete(customer_user, vendor_user):

  product = Product.objects.create(name="Mug", price=10.00, stock=50, vendor=vendor_user)
  order = Order.objects.create(customer=customer_user)
  OrderItem.objects.create(order=order, product=product, quantity=1)

  assert OrderItem.objects.count() == 1
  Order.objects.count() == 1
  order.delete()
  assert OrderItem.objects.count() == 0

@pytest.mark.django_db
def test_cannot_delete_product_if_in_order(customer_user, vendor_user):
    
  product = Product.objects.create(name="Phone", price=500.00, stock=5, vendor=vendor_user)
  order = Order.objects.create(customer=customer_user)
  OrderItem.objects.create(order=order, product=product, quantity=1)

  with pytest.raises(ProtectedError):
    product.delete()

@pytest.mark.django_db
def test_order_status_default_and_update(customer_user):
  order = Order.objects.create(customer=customer_user)

  assert order.status == Order.PENDING

  order.status = Order.CONFIRMED
  order.save()
  
  saved_order = Order.objects.get(id=order.id)
  assert saved_order.status == Order.CONFIRMED