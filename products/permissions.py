from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsVendor(BasePermission):
  def has_permission(self, request, view):

    if request.method in SAFE_METHODS:
      return request.user.is_authenticated 
    
    return request.user.is_authenticated and request.user.role == "VENDOR"
  
  def has_object_permission(self, request, view, obj):
    if request.method in SAFE_METHODS:
      return True
    
    if request.user.is_superuser or request.user.role == "ADMIN":
      return True
    
    if request.user.role == "VENDOR":
      return request.user.id == obj.vendor_id
    
    return False