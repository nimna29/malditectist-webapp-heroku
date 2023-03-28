from django.urls import path
from . import views

# Define URL patterns for the app
urlpatterns = [
    # Define a URL pattern for the file upload function-based view
    path('api/upload_file/', views.upload_file, name='upload_file'),
    path('api/get_result/<str:result_id>/', views.get_result, name='get_result'),
]
