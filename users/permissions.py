from rest_framework import permissions

class IsAdmin(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
      if request.user.is_superuser or request.user.role == 'ADMIN':
        return True
      
      return obj.id == request.user.id