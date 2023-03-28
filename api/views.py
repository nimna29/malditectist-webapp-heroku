from datetime import timedelta
import threading
from concurrent.futures import ThreadPoolExecutor
from django.core.cache import cache
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .ml import classify_file
from firebase import bucket
from dotenv import load_dotenv
import os
from threading import Lock


# Load environment variables from the .env file
load_dotenv()

# Read the MAX_WORKERS environment variable and convert it to an integer
MAX_WORKERS = int(os.getenv('MAX_WORKERS', 5))

# Use the MAX_WORKERS value when creating the ThreadPoolExecutor
executor = ThreadPoolExecutor(max_workers=MAX_WORKERS)

# Add a global counter and a Lock for thread safety
active_threads_counter = 0
counter_lock = Lock()


@api_view(['POST'])
def upload_file(request):
    """
    Handles the file upload and classification for small files.
    """
    # Get the file and unique_key from the request, and check for errors
    file, unique_key, errors = get_file_and_unique_key(request)
    if errors:
        return errors

    # Upload the file to Firebase Storage, and get the filename, blob, and signed URL
    filename, blob, file_url = upload_to_firebase(file, unique_key)

    # Pass the file to the classify_file function for analysis
    result = classify_file(file_url)
    if result is None:
        return Response({'error': 'Failed to classify file'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Delete the uploaded file from Firebase Storage
    blob.delete()

    # Return the result of the classification to the frontend
    return Response(result, status=status.HTTP_200_OK)


def process_large_file(file_url, result_id, blob):
    """
    Processes large files in a separate thread.
    """
    global active_threads_counter
    global counter_lock

    # Set a placeholder value in the cache to indicate that the file is being processed
    cache.set(result_id, "processing", 15 * 60)

    # Pass the file to the classify_file function for analysis
    result = classify_file(file_url)
    if result is not None:
        # Save the result to the cache for 15 minutes
        cache.set(result_id, result, 15 * 60)

    # Delete the uploaded file from Firebase Storage
    blob.delete()

    # Decrease the active threads counter
    with counter_lock:
        active_threads_counter -= 1


@api_view(['POST'])
def upload_large_file(request):
    """
    Handles the file upload and classification for large files.
    """
    global active_threads_counter
    global counter_lock

    # Get the file and unique_key from the request, and check for errors
    file, unique_key, errors = get_file_and_unique_key(request)
    if errors:
        return errors

    # Get the result_id from the request
    result_id = request.data.get('result_id')
    if result_id is None:
        return Response({'error': 'Result ID not found in request.'}, status=status.HTTP_400_BAD_REQUEST)

    # Upload the file to Firebase Storage, and get the filename, blob, and signed URL
    filename, blob, file_url = upload_to_firebase(file, unique_key)

    # Check if the number of active threads exceeds the MAX_WORKERS limit
    with counter_lock:
        if active_threads_counter >= MAX_WORKERS:
            return Response({'error': 'Server is busy. Please try again later.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        active_threads_counter += 1

    # Start processing the large file in a separate thread
    threading.Thread(target=process_large_file, args=(file_url, result_id, blob)).start()

    # Return the result_id to the frontend
    return Response({'result_id': result_id}, status=status.HTTP_200_OK)


@api_view(['GET'])
def search_result(request, result_id):
    """
    Returns the classification result based on the result_id.
    """
    # Get the result from the cache using the result_id
    result = cache.get(result_id)

    # If the result is not found or expired, return an error
    if result is None:
        return Response({'error': 'Result not found or expired.'}, status=status.HTTP_404_NOT_FOUND)

    # If the result is still being processed, return a "processing" status
    if isinstance(result, str) and result == "processing":
        return Response({'processing': True}, status=status.HTTP_200_OK)

    # If the result is available, delete it from the cache and return it to the frontend
    cache.delete(result_id)
    return Response(result, status=status.HTTP_200_OK)


def get_file_and_unique_key(request):
    """
    Retrieves the file and unique_key from the request, and returns any errors.
    """
    file = request.FILES.get('file')
    if file is None:
        return None, None, Response({'error': 'File not found in request'}, status=status.HTTP_400_BAD_REQUEST)

    if not file.name.endswith('.exe'):
        return None, None, Response({'error': 'Invalid file type. Only .exe files are supported.'},
                                     status=status.HTTP_400_BAD_REQUEST)

    unique_key = request.data.get('unique_key')
    if unique_key is None:
        return None, None, Response({'error': 'Unique key not found in request.'}, status=status.HTTP_400_BAD_REQUEST)

    return file, unique_key, None


def upload_to_firebase(file, unique_key):
    """
    Uploads the given file to Firebase Storage, and returns the filename, blob, and signed URL.
    """
    filename = f"{unique_key}_{file.name}"
    blob = bucket.blob(filename)
    blob.upload_from_file(file)

    file_url = blob.generate_signed_url(
        expiration=timedelta(minutes=30), method='GET')

    return filename, blob, file_url

