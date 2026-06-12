from celery import shared_task
from django.core.mail import send_mail

@shared_task
def send_order_email(email):
  try:
    send_mail(
      'Order Placed',
      'Your order has been placed successfully',
      'ebaadlion@gmail.com',
      [email],
      fail_silently=False
    )
  except Exception as e:
    print("Email failed:", e)
      