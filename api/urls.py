from django.urls import path
from . import views

# Define URL patterns for the app
urlpatterns = [
    path('api/upload_file/', views.upload_file, name='upload_file'),
    path('api/upload_large_file/', views.upload_large_file, name='upload_large_file'),
    path('api/search_result/<str:result_id>/', views.search_result, name='search_result'),
]
