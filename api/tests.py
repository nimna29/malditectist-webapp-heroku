from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, RequestFactory
from rest_framework import status
from unittest import mock
from . import views
from firebase import bucket
from django.core.cache import cache
from django.urls import reverse


class UploadFileViewTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def create_file_upload_request(self, file_name, unique_key, content_type="application/octet-stream"):
        file = SimpleUploadedFile(
            file_name, b"file_content", content_type=content_type)
        request = self.factory.post(
            "/upload-file/", {"file": file, "unique_key": unique_key})
        return request


    def test_upload_file_success(self):
            # Mock classify_file, upload_to_firebase and bucket.blob.delete so they don't actually execute
            with mock.patch("api.views.classify_file") as mock_classify_file, \
                mock.patch("api.views.upload_to_firebase") as mock_upload_to_firebase, \
                mock.patch.object(bucket, 'blob') as mock_bucket_blob:

                # Set up mock return values
                mock_classify_file.return_value = {"classification": "malware"}
                mock_upload_to_firebase.return_value = (
                    "file_name", mock_bucket_blob, "file_url")
                mock_bucket_blob.delete = mock.Mock()

                request = self.create_file_upload_request("test.exe", "12345")
                response = views.upload_file(request)

                self.assertEqual(response.status_code, status.HTTP_200_OK)
                self.assertEqual(response.data, {"classification": "malware"})

    def test_upload_file_invalid_file_type(self):
        request = self.create_file_upload_request("test.txt", "12345")
        response = views.upload_file(request)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {"error": "Invalid file type. Only .exe files are supported."})

    def test_upload_file_missing_unique_key(self):
        file = SimpleUploadedFile("test.exe", b"file_content", content_type="application/octet-stream")
        request = self.factory.post("/upload-file/", {"file": file})
        response = views.upload_file(request)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {"error": "Unique key not found in request."})


class UploadLargeFileViewTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_upload_large_file_success(self):
        # Mock process_large_file so it doesn't actually execute
        with mock.patch("api.views.process_large_file") as mock_process_large_file, \
             mock.patch("api.views.upload_to_firebase") as mock_upload_to_firebase, \
             mock.patch.object(bucket, 'blob') as mock_bucket_blob:

            # Set up mock return values
            mock_upload_to_firebase.return_value = ("file_name", mock_bucket_blob, "file_url")
            mock_bucket_blob.delete = mock.Mock()

            file = SimpleUploadedFile("large_test.exe", b"file_content", content_type="application/octet-stream")
            request = self.factory.post("/upload-large-file/", {"file": file, "unique_key": "12345", "result_id": "result_id"})
            response = views.upload_large_file(request)

            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.data, {"result_id": "result_id"})


class SearchResultViewTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_search_result_success(self):
        result_id = "test_result_id"
        cache.set(result_id, {"classification": "malware"}, 15 * 60)

        request = self.factory.get(reverse("search_result", args=[result_id]))
        response = views.search_result(request, result_id)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"classification": "malware"})

    def test_search_result_not_found(self):
        result_id = "non_existent_result_id"

        request = self.factory.get(reverse("search_result", args=[result_id]))
        response = views.search_result(request, result_id)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {"error": "Result not found or expired."})
