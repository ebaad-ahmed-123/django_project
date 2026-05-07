from rest_framework.permissions import BasePermission

class IsAdminOrderItems(BasePermission):
  def has_permission(self, request, view):
    return request.user.is_authenticated
    
  def has_object_permission(self, request, view, obj):
    if request.user.is_superuser or request.user.role == "ADMIN":
      return True
    return obj.order.customer == request.user
  
class IsAdmin(BasePermission):
  def has_permission(self, request, view):
    return request.user.is_authenticated
  
  def has_object_permission(self, request, view, obj):
    return request.user.is_superuser or request.user.role == "ADMIN"

