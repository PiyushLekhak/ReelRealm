from django.contrib import admin
from api.models import User, Profile, Watchlist, Rating, Movie, UserInterest, Recommendation
from import_export.admin import ImportExportModelAdmin

class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email']

class ProfileAdmin(admin.ModelAdmin):
    list_editable = ['verified']
    list_display = ['user', 'full_name', 'verified']

class WatchlistAdmin(admin.ModelAdmin):
    list_display = ['user', 'movie_id']

class RatingAdmin(admin.ModelAdmin):
    list_display = ['user', 'movie_id', 'rating']

class MovieAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ['movie_id', 'movie_title', 'movie_features']

class UserInterestAdmin(admin.ModelAdmin):
    list_display = ['user', 'interest']

class RecommendationAdmin(admin.ModelAdmin):
    list_display = ['user', 'movie']

admin.site.register(User, UserAdmin)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(Watchlist, WatchlistAdmin)
admin.site.register(Rating, RatingAdmin)
admin.site.register(Movie, MovieAdmin)
admin.site.register(UserInterest, UserInterestAdmin)
admin.site.register(Recommendation, RecommendationAdmin)
