from django.db import transaction
from django.core.exceptions import ValidationError
from .models import Order, OrderItem

class OrderService:
    @staticmethod
    @transaction.atomic
    def create_order(user, items_data):
        if Order.objects.filter(customer=user, status="PENDING").exists():
            raise ValidationError("Kindly checkout your previous order")
        
        if user.role == "VENDOR":
            raise ValidationError("Vendors cannot place orders")
        
        order = Order.objects.create(customer=user, status="PENDING")

        for item in items_data:
            product = item['product']
            qty = item['quantity']

            if product.stock < qty:
                raise ValidationError(f"Not enough stock for {product.name}")

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=qty
            )

        return order

    @staticmethod
    def create_order_item(user, validated_data):
        order, _ = Order.objects.get_or_create(customer=user, status="PENDING")
        product = validated_data['product']
        quantity = validated_data['quantity']

        # Check if the requested quantity exceeds available stock
        if product.stock < quantity:
            raise ValidationError("Not enough stock")

        order_item, created = OrderItem.objects.get_or_create(
            order=order,
            product=product,
            defaults={'quantity': quantity}
        )

        if not created:
            # Check if total requested quantity exceeds stock
            if product.stock < (order_item.quantity + quantity):
                raise ValidationError("Not enough stock for this quantity")
            
            order_item.quantity += quantity
            order_item.save()

        return order_item