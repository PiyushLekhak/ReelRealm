from django.shortcuts import render
from django.http import JsonResponse
from api.models import User,Watchlist,Rating,UserInterest,Recommendation, UserAnalytics

from api.serializer import MyTokenObtainPairSerializer, RegisterSerializer, WatchlistSerializer, RatingSerializer, UserInterestSerializer,RecommendationSerializer, ProfileSerializer
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
@permission_classes([IsAuthenticated])
def check_watchlist(request, movie_id):
    try:
        # Check if the movie is in the user's watchlist
        is_in_watchlist = Watchlist.objects.filter(user=request.user, movie_id=movie_id).exists()
        
        return Response({'is_in_watchlist': is_in_watchlist}, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def rate_movie(request):
    try:
        user = request.user
        movie_id = request.data.get('movie_id')
        rating_value = request.data.get('rating')
        
        # Check if movie_id and rating are provided
        if not movie_id or not rating_value:
            return Response({'error': 'Movie ID and rating are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate rating value (assuming rating is between 1 to 10)
        if not 1 <= rating_value <= 10:
            return Response({'error': 'Rating value must be between 1 and 10'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if the user has already rated the movie
        existing_rating = Rating.objects.filter(user=user, movie_id=movie_id).first()
        if existing_rating:
            # Update existing rating
            existing_rating.rating = rating_value
            existing_rating.save()
            return Response({'message': 'Rating updated successfully'}, status=status.HTTP_200_OK)
        else:
            # Create new rating
            rating = Rating.objects.create(user=user, movie_id=movie_id, rating=rating_value)
            return Response({'message': 'Rating submitted successfully'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_rated_movies(request):
    try:
        # Retrieving movies rated by the user
        rated_movies = Rating.objects.filter(user=request.user)
        serializer = RatingSerializer(rated_movies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_rating(request, movie_id):
    try:
        user = request.user
        
        # Retrieve the rating for the movie by the user
        rating = Rating.objects.get(user=user, movie_id=movie_id)
        
        # Serialize the rating data
        serializer = RatingSerializer(rating)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Rating.DoesNotExist:
        return Response({'error': 'Rating not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_rating(request, movie_id):
    try:
        user = request.user
        
        # Retrieve and delete the rating for the movie by the user
        rating = Rating.objects.get(user=user, movie_id=movie_id)
        rating.delete()
        
        return Response({'message': 'Rating deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Rating.DoesNotExist:
        return Response({'error': 'Rating not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_user_interest(request):
    try:
        # Extract data from the request
        genre = request.data.get('genre')
        overview = request.data.get('overview')

        # Combine genre and overview into a single string
        interest = f"{genre} {overview}"

        # Validate and save user interest
        serializer = UserInterestSerializer(data={'user': request.user.id, 'interest': interest})
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_interest(request):
    try:
        user = request.user
        
        # Retrieve user's interests
        interests = UserInterest.objects.filter(user=user)
        serializer = UserInterestSerializer(interests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user_interest(request, interest_id):
    try:
        user = request.user
        
        # Retrieve and delete user's interest
        interest = UserInterest.objects.get(user=user, id=interest_id)
        interest.delete()
        
        return Response({'message': 'User interest deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except UserInterest.DoesNotExist:
        return Response({'error': 'User interest not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recommendations(request):
    try:
        # Retrieving user's recommendations
        recommendations = Recommendation.objects.filter(user=request.user)
        serializer = RecommendationSerializer(recommendations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_total_rated_movies(request):
    try:
        user_analytics = UserAnalytics.objects.get(user=request.user)
        data = {'total_rated_movies': user_analytics.total_rated_movies}
        return Response(data, status=status.HTTP_200_OK)
    except UserAnalytics.DoesNotExist:
        return Response({'error': 'User analytics data not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_favorite_movie(request):
    try:
        user_analytics = UserAnalytics.objects.get(user=request.user)
        data = {'favorite_movie': user_analytics.favorite_movie}
        return Response(data, status=status.HTTP_200_OK)
    except UserAnalytics.DoesNotExist:
        return Response({'error': 'User analytics data not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_total_movies_in_watchlist(request):
    try:
        user_analytics = UserAnalytics.objects.get(user=request.user)
        data = {'total_movies_in_watchlist': user_analytics.total_movies_in_watchlist}
        return Response(data, status=status.HTTP_200_OK)
    except UserAnalytics.DoesNotExist:
        return Response({'error': 'User analytics data not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_top_5_genres(request):
    try:
        user_analytics = UserAnalytics.objects.get(user=request.user)
        data = {'top_5_genres': user_analytics.top_5_genres}
        return Response(data, status=status.HTTP_200_OK)
    except UserAnalytics.DoesNotExist:
        return Response({'error': 'User analytics data not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    try:
        # Retrieve data from request
        full_name = request.data.get('full_name')
        bio = request.data.get('bio')

        # Retrieve the profile instance associated with the current user
        profile = request.user.profile

        # Update the profile fields if data is provided
        if full_name is not None:
            profile.full_name = full_name
        if bio is not None:
            profile.bio = bio

        # Save the updated profile
        profile.save()

        # Serialize the updated profile data
        serializer = ProfileSerializer(profile)

        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)