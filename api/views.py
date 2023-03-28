from rest_framework.response import Response
from rest_framework import status
from .ml import classify_file
from rest_framework import status
from rest_framework.decorators import api_view
from firebase import bucket
from datetime import timedelta
from django.core.cache import cache
from threading import Thread
from uuid import uuid4
import time


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
    
    print("Start Uploading File")

    # Upload the file to Firebase Storage
    filename = f"{unique_key}_{file.name}"
    blob = bucket.blob(filename)
    blob.upload_from_file(file)
    
    print("File Uploaded to Firebase")

    # Get the private URL of the uploaded file
    file_url = blob.generate_signed_url(
        expiration=timedelta(minutes=30), method='GET')
    print("Private URL Generated")
    
    # Pass the file to the classify_file function for analysis
    try:
        # time.sleep(5)  # Sleep for 5 seconds to simulate a long processing time
        # raise TimeoutError("Simulated TimeoutError for testing purposes.")
        result = classify_file(file_url)
        print("File Process Completed")
        if result is None:
            return Response({'error': 'Failed to classify file'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Delete the uploaded file from Firebase Storage
        blob.delete()
        print("File Deleted From Firebase")
        
        # Return the result of the classification to the frontend
        return Response(result, status=status.HTTP_200_OK)
        
    except TimeoutError:
        # If the classification process takes too long, cache the result ID and start a new thread to process it
        result_id = str(uuid4())
        cache.set(result_id + "_status", "processing", 1800)
        thread = Thread(target=process_and_cache_result,
                        args=(file_url, result_id, blob))
        thread.start()

        # Return a message to the frontend indicating that the process is still ongoing
        return Response({
            "message": f"Process will take some time. This is your Result ID: {result_id}", "result_id": result_id
        }, status=status.HTTP_408_REQUEST_TIMEOUT)


# Define a function to process and cache the result if TimeoutError occurs during file classification
def process_and_cache_result(file_url, result_id, blob):
    result = classify_file(file_url)
    
    # Cache the result and its status for 15 minutes
    cache.set(result_id, result, 900)
    cache.set(result_id + "_status", "completed", 900)    
    
    # Check if the result and its status have been saved in the cache
    if cache.get(result_id) == result and cache.get(result_id + "_status") == "completed":
        print("File Process Completed")
        # Delete the uploaded file from Firebase Storage if it exists
        if blob.exists():
            blob.delete()
            print("File Deleted From Firebase")


# Define a function-based view to retrieve the result with the specified result ID      
@api_view(['GET'])
def get_result(request, result_id):
    result_status = cache.get(result_id + "_status")
    if result_status == "processing":
        # Return a message to the frontend indicating that the result is still being processed
        return Response({"status": "processing"}, status=status.HTTP_202_ACCEPTED)
    
    elif result_status == "completed":
        # Return the cached result to the frontend
        result = cache.get(result_id)
        return Response(result, status=status.HTTP_200_OK)
    
    else:
        # Return an error message if the result ID is not found
        return Response({"error": "Result ID not found"}, status=status.HTTP_404_NOT_FOUND)
