# In your app's urls.py
from django.urls import path
from . import views
# 🌟 ADD THIS IMPORT LINE 🌟
from django.contrib.auth import views as auth_views
urlpatterns = [
    # --- Frontend/Page Views ---
    path('', views.send_otp_page, name='send_otp_page'),
    path('verify_otp_page/', views.verify_otp_page, name='verify_otp_page'),
    path('dashboard/', views.dashboard, name='dashboard'), # Patient Dashboard
    path('hospital-dashboard/', views.hospital_dashboard, name='hospital_dashboard'), # Staff Dashboard4
]