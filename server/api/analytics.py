from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Rating, Watchlist, UserInterest, UserAnalytics

# Signal handler for Rating model
@receiver([post_save, post_delete], sender=Rating)
def update_rating_data(sender, instance, **kwargs):
    user = instance.user
    # Update total rated movies in UserAnalytics
    user_analytics, created = UserAnalytics.objects.get_or_create(user=user)
    user_analytics.total_rated_movies = Rating.objects.filter(user=user).count()
    # Update favorite movie if needed
    favorite_rating = Rating.objects.filter(user=user).order_by('-rating').first()
    user_analytics.favorite_movie = favorite_rating.movie_id if favorite_rating else None
    user_analytics.save()

# Signal handler for Watchlist model
@receiver([post_save, post_delete], sender=Watchlist)
def update_watchlist_data(sender, instance, **kwargs):
    user = instance.user
    # Update total movies in watchlist in UserAnalytics
    user_analytics, created = UserAnalytics.objects.get_or_create(user=user)
    user_analytics.total_movies_in_watchlist = Watchlist.objects.filter(user=user).count()
    user_analytics.save()

# Predefined genre list
GENRE_LIST = [
    "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary",
    "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Mystery",
    "Romance", "Science Fiction", "Thriller", "TV Movie", "War", "Western"
]

# Signal handler for UserInterest model
@receiver([post_save, post_delete], sender=UserInterest)
def update_user_interest_data(sender, instance, **kwargs):
    user = instance.user
    # Initialize counts for each genre
    interest_count = {genre: 0 for genre in GENRE_LIST}
    
    # Extract all user interests and count their occurrences
    all_interests = user.userinterest_set.all().values_list('interest', flat=True)
    for interest in all_interests:
        for genre in GENRE_LIST:
            if genre.lower() in interest.lower():
                interest_count[genre] += 1
    
    # Sort the interests by count in descending order
    sorted_genres = sorted(interest_count, key=interest_count.get, reverse=True)
    
    # Get the top genres with at least 1 count but not more than 5
    top_interests = [genre for genre in sorted_genres if interest_count[genre] >= 1][:5]
    
    # Update top genres in UserAnalytics
    user_analytics, created = UserAnalytics.objects.get_or_create(user=user)
    user_analytics.top_5_genres = ', '.join(top_interests)
    user_analytics.save()

