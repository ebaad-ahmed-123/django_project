from rest_framework.views import APIView
from rest_framework import viewsets
from .models import User
from .serializers import UserSerializer, RegisterSerializer
# from rest_framework.decorators import action
from rest_framework.response import Response
from .permissions import IsAdmin
from rest_framework.permissions import IsAuthenticated, AllowAny

class UserViewSet(viewsets.ModelViewSet):
  queryset = User.objects.all()
  serializer_class = UserSerializer

  def get_queryset(self):
    user = self.request.user
    
    if not user.is_authenticated:
      return User.objects.none()
    
    if user.is_superuser:
      return User.objects.all()
    
    return User.objects.filter(id=user.id)

  def get_permissions(self):
    if self.action == 'create':
      return [IsAdmin()]
    
    elif self.action in ['list']:
      return [IsAuthenticated(), IsAdmin()]  
    
    elif self.action in ['retrieve', 'update', 'partial_update']:
      return [IsAuthenticated()]  
    
    return [IsAuthenticated(), IsAdmin()]
  
  filterset_fields = ['email', 'name']
  search_fields = ['email', 'name']
  ordering_fields = ['id']
  ordering = ['-id']
  
class RegisterView(APIView):
  permission_classes = [AllowAny]
  authentication_classes = [] 

  def post(self, request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    serializer.save()
    return Response({"message":"User created successfully"})