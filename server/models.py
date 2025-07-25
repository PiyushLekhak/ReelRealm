# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class ApiMovie(models.Model):
    id = models.BigAutoField(primary_key=True)
    movie_id = models.IntegerField(unique=True, blank=True, null=True)
    movie_title = models.CharField(max_length=255, blank=True, null=True)
    movie_features = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'api_movie'


class ApiProfile(models.Model):
    id = models.BigAutoField(primary_key=True)
    full_name = models.CharField(max_length=100)
    bio = models.CharField(max_length=100)
    image = models.CharField(max_length=100)
    verified = models.IntegerField()
    user = models.OneToOneField('ApiUser', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'api_profile'


class ApiRating(models.Model):
    id = models.BigAutoField(primary_key=True)
    movie_id = models.IntegerField()
    rating = models.IntegerField()
    user = models.ForeignKey('ApiUser', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'api_rating'
        unique_together = (('user', 'movie_id'),)


class ApiUser(models.Model):
    id = models.BigAutoField(primary_key=True)
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()
    username = models.CharField(max_length=100)
    email = models.CharField(unique=True, max_length=254)

    class Meta:
        managed = False
        db_table = 'api_user'


class ApiUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(ApiUser, models.DO_NOTHING)
    group = models.ForeignKey('AuthGroup', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'api_user_groups'
        unique_together = (('user', 'group'),)


class ApiUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(ApiUser, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'api_user_user_permissions'
        unique_together = (('user', 'permission'),)


class ApiUserinterest(models.Model):
    id = models.BigAutoField(primary_key=True)
    interest = models.TextField()
    user = models.ForeignKey(ApiUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'api_userinterest'


class ApiWatchlist(models.Model):
    id = models.BigAutoField(primary_key=True)
    movie_id = models.IntegerField()
    user = models.ForeignKey(ApiUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'api_watchlist'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(ApiUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class TokenBlacklistBlacklistedtoken(models.Model):
    id = models.BigAutoField(primary_key=True)
    blacklisted_at = models.DateTimeField()
    token = models.OneToOneField('TokenBlacklistOutstandingtoken', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'token_blacklist_blacklistedtoken'


class TokenBlacklistOutstandingtoken(models.Model):
    id = models.BigAutoField(primary_key=True)
    token = models.TextField()
    created_at = models.DateTimeField(blank=True, null=True)
    expires_at = models.DateTimeField()
    user = models.ForeignKey(ApiUser, models.DO_NOTHING, blank=True, null=True)
    jti = models.CharField(unique=True, max_length=255)

    class Meta:
        managed = False
        db_table = 'token_blacklist_outstandingtoken'
