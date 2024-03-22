from django.shortcuts import render
from django.http import JsonResponse
from api.models import User,Watchlist

from api.serializer import MyTokenObtainPairSerializer, RegisterSerializer, WatchlistSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_watchlist(request):
    try:
        # Extracting user_id and movie_id from request data
        user_id = request.data.get('user_id')
        movie_id = request.data.get('movie_id')

        # Checking if the movie is already in the watchlist for the given user
        existing_entry = Watchlist.objects.filter(user_id=user_id, movie_id=movie_id).exists()
        if existing_entry:
            return Response({'error': 'Movie is already in the watchlist'}, status=status.HTTP_400_BAD_REQUEST)

        # Saving new entry to the watchlist
        serializer = WatchlistSerializer(data={'user': user_id, 'movie_id': movie_id})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_watchlist(request, movie_id):
    try:
        # Checking if the movie is in the watchlist
        entry = Watchlist.objects.get(user=request.user, movie_id=movie_id)
        entry.delete()
        return Response({'message': 'Movie removed from watchlist'}, status=status.HTTP_204_NO_CONTENT)
    except Watchlist.DoesNotExist:
        return Response({'error': 'Watchlist entry not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_watchlist(request):
    try:
        # Retrieving user's watchlist
        entries = Watchlist.objects.filter(user=request.user)
        serializer = WatchlistSerializer(entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token/',
        '/api/register/',
        '/api/token/refresh/'
    ]
    return Response(routes)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def testEndPoint(request):
    if request.method == 'GET':
        data = f"Congratulation {request.user}, your API just responded to GET request"
        return Response({'response': data}, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        text = "Hello buddy"
        data = f'Congratulation your API just responded to POST request with text: {text}'
        return Response({'response': data}, status=status.HTTP_200_OK)
    return Response({}, status.HTTP_400_BAD_REQUEST)