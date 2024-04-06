from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView


from django.contrib.auth import views as auth_views

admin.site.site_header = "ReelRealm Admin"
admin.site.site_title = "ReelRealm Admin Portal"
admin.site.index_title = "Welcome to ReelRealm"

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include("api.urls")),
    path('reset_password/',auth_views.PasswordResetView.as_view(),name="reset_password"),
    path('reset_password_sent/',auth_views.PasswordResetDoneView.as_view(),name="password_reset_done"),
    path('reset/<uidb64>/<token>/',auth_views.PasswordResetConfirmView.as_view(),name="password_reset_confirm"),
    path('reset_password_complete/',auth_views.PasswordResetCompleteView.as_view(),name="password_reset_complete"),
    path('accounts/login/', RedirectView.as_view(url='http://localhost:3000/login'), name='login_redirect'),
]
