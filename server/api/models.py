from django.db import models
from django.db.models.signals import post_save
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    username = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100)
    bio = models.CharField(max_length=100)
    image = models.ImageField(upload_to="user_images", default="default.jpg")
    verified = models.BooleanField(default=False)

    def __str__(self):
        return self.full_name

class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie_id = models.IntegerField()

    def __str__(self):
        return f"Watchlist Entry for {self.user.username}"
    
class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie_id = models.IntegerField()
    rating = models.IntegerField()

    class Meta:
        unique_together = ('user', 'movie_id')  # Each user can rate a movie only once

    def __str__(self):
        return f"Rating {self.rating} by {self.user.username} for {self.movie_id}"
    
class Movie(models.Model):
    movie_id = models.IntegerField(unique=True)
    movie_title = models.CharField(max_length=255)
    movie_features = models.TextField()

    def __str__(self):
        return self.movie_title

class UserInterest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    interest = models.TextField()

    def __str__(self):
        return f"Interest of {self.user.username}"
    
class Recommendation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie_id = models.IntegerField()

    def __str__(self):
        return f"Recommendation for {self.user.username}"

def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

post_save.connect(create_user_profile, sender=User)
post_save.connect(save_user_profile, sender=User)