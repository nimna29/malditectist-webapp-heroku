from rest_framework.response import Response
from rest_framework import status
from .ml import classify_file
from rest_framework import status
from rest_framework.decorators import api_view
from firebase import bucket
from datetime import timedelta


# Define a function-based view to handle file uploads
@api_view(['POST'])
def upload_file(request):
    # Get the file object from the request
    file = request.FILES.get('file')
    if file is None:
        return Response({'error': 'File not found in request'}, status=status.HTTP_400_BAD_REQUEST)

    # Check if the file type is valid
    if not file.name.endswith('.exe'):
        return Response({'error': 'Invalid file type. Only .exe files are supported.'},
                        status=status.HTTP_400_BAD_REQUEST)
    
    # Get a unique key associated with the file
    unique_key = request.data.get('unique_key')
    if unique_key is None:
        return Response({'error': 'Unique key not found in request.'}, status=status.HTTP_400_BAD_REQUEST)

    # Upload the file to Firebase Storage
    filename = f"{unique_key}_{file.name}"
    blob = bucket.blob(filename)
    blob.upload_from_file(file)

    # Get the private URL of the uploaded file
    file_url = blob.generate_signed_url(
        expiration=timedelta(minutes=30), method='GET')

    # Pass the file to the classify_file function for analysis
    result = classify_file(file_url)
    if result is None:
        return Response({'error': 'Failed to classify file'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # Return the result of the classification to the frontend
    return Response(result, status=status.HTTP_200_OK)
