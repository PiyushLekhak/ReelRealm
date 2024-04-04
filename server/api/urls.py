from django.urls import path
from . import views
from . import recommender, analytics

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegisterView.as_view(), name='auth_register'),
    path('add_to_watchlist/', views.add_to_watchlist, name='add_to_watchlist'),
    path('remove_from_watchlist/<int:movie_id>/', views.remove_from_watchlist, name='remove_from_watchlist'),
    path('get_watchlist/', views.get_watchlist, name='get_watchlist'),
    path('check_watchlist/<int:movie_id>/', views.check_watchlist, name='check_watchlist'),
    path('rate_movie/', views.rate_movie, name='rate_movie'),
    path('get_user_rated_movies/', views.get_user_rated_movies, name='get_user_rated_movies'),
    path('get_rating/<int:movie_id>/', views.get_rating, name='get_rating'),
    path('delete_rating/<int:movie_id>/', views.delete_rating, name='delete_rating'),
    path('save_user_interest/', views.save_user_interest, name='save_user_interest'),
    path('get_user_interest/', views.get_user_interest, name='get_user_interest'),
    path('delete_user_interest/', views.delete_user_interest, name='delete_user_interest'),
    path('get_recommendations/', views.get_recommendations, name='get_recommendations'),
]