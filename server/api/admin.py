from django.contrib import admin
from api.models import User,Profile,Watchlist

class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email']


class ProfileAdmin(admin.ModelAdmin):
    list_editable = ['verified']
    list_display = ['user', 'full_name' ,'verified']

class WatchlistAdmin(admin.ModelAdmin):
    list_display = ['user', 'movie_id']

admin.site.register(User, UserAdmin)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(Watchlist, WatchlistAdmin)
