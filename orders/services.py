from django.core.exceptions import ValidationError
from .models import Order, OrderItem

class OrderService:
  @staticmethod
  def create_order(user, items_data):
    if Order.objects.filter(customer=user,status="PENDING").exists():
      raise ValidationError("Kindly checkout your previous order")
    if user.role == "VENDOR":
      raise ValidationError("Vendor cannot place order")
    order = Order.objects.create(customer=user, status="PENDING")


    for item in items_data:
      product = item['product']
      qty = item['quantity']

      if product.stock < qty:
        raise ValueError("not enough stock")

      OrderItem.objects.create(
        order=order,
        product=product,
        quantity=qty,
      )

      product.stock -= qty
      product.save()

    return order

  @staticmethod
  def create_order_item(user, validated_data):
    order, _ = Order.objects.get_or_create(
      customer=user,
      status="PENDING"
    )

    product = validated_data['product']
    quantity = validated_data['quantity']

    if product.stock < quantity:
      raise ValidationError("Not enough stock")

    order_item, created = OrderItem.objects.get_or_create(
      order=order,
      product=product,
      defaults={'quantity': quantity}
    )

    if not created:
      order_item.quantity += quantity
      order_item.save()

    product.stock -= quantity
    product.save()

    return order_item