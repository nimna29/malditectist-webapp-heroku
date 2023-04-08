/* A custom hook that is used to upload files to the server, and get the result.*/
import { useState, useRef } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { MlResult } from '../types/MlResult';


// File size limits
let fileSizeLimit: number = Number(process.env.REACT_APP_FILE_SIZE_LIMIT) || 30;
let uploadFileSizeLimit: number = Number(process.env.REACT_APP_UPLOAD_FILE_SIZE_LIMIT) || 150;

export const useFileUpload = () => {
    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
    const [mlResult, setMLResult] = useState<MlResult | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [uniqueKey, setUniqueKey] = useState<string>(Date.now().toString());
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [resultId, setResultId] = useState<string | null>(null);
    const [searchResult, setSearchResult] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false);
    const [uploadButtonDisabled, setUploadButtonDisabled] = useState<boolean>(false);
    const resultAreaRef = useRef<HTMLDivElement>(null);
    const [resultNotFoundError, setResultNotFoundError] = useState(false);


    const handleFileSelect = (file: File[]) => {
        setSelectedFile(file[0]);
        setErrorMessage(null);
        setMLResult(null);
        setUniqueKey(Date.now().toString());
        setUploadProgress(0);
        setResultId(null);
        setSearchResult(false);

        if (file[0].size > uploadFileSizeLimit * 1024 * 1024) {
            setErrorMessage(`Upload file size exceeds the limit of ${uploadFileSizeLimit}MB.`);
            setUploadButtonDisabled(true);
            return;
        }
        else {
            setUploadButtonDisabled(false);
        }

        const addFileIcon = document.querySelector('.add-file-icon');
        if (addFileIcon) {
            addFileIcon.classList.add('selected');
        }
    };

    const handleFileUpload = async () => {
        if (selectedFile === undefined) {
            return;
        }

        // Reset states when the user clicks the Upload button
        setMLResult(null);
        setErrorMessage(null);
        setUniqueKey(Date.now().toString());
        setUploadProgress(0);
        setResultId(null);
        setSearchResult(false);
        setProcessing(false);

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('unique_key', uniqueKey);
        const generatedResultId = uuidv4(); // Generate a result_id using uuid
        formData.append('result_id', generatedResultId); // Add result_id to formData


        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / (progressEvent.total ?? selectedFile.size)
                );
                setUploadProgress(percentCompleted);
            },
        };

        try {
            const isProduction = process.env.NODE_ENV === 'production';
            const apiUrl = isProduction
                ? '/api/upload_file/'
                : 'http://localhost:8000/api/upload_file/';
            const largeFileApiUrl = isProduction
                ? '/api/upload_large_file/'
                : 'http://localhost:8000/api/upload_large_file/';

            const targetApiUrl =
                selectedFile.size > fileSizeLimit * 1024 * 1024 ? largeFileApiUrl : apiUrl;

            const response = await axios.post(targetApiUrl, formData, config);

            if (response.status === 503) {
                setErrorMessage('Server is busy. Please try again later.');
            } else if (targetApiUrl === largeFileApiUrl) {
                setResultId(response.data.result_id);
            } else {
                setMLResult({
                    prediction: response.data.prediction,
                    rf_probability: response.data.rf_probability,
                    nn_prediction: response.data.nn_prediction,
                });
            }
        } catch (error: any) {
            console.error(error);
            if (error.response && error.response.status === 400) {
                setErrorMessage(error.response.data.error);
            }
            else {
                setErrorMessage('An unknown error occurred while uploading the file.');
            }
        } finally {
            setUploadProgress(0);
        }
    };

    const handleSearchResult = async () => {
        if (resultId === null) {
            return;
        }

        try {
            const isProduction = process.env.NODE_ENV === 'production';
            const apiUrl = isProduction
                ? `/api/search_result/${resultId}/`
                : `http://localhost:8000/api/search_result/${resultId}/`;

            const response = await axios.get(apiUrl);

            if (response.status === 404) {
                setResultNotFoundError(true);
                setErrorMessage(null);
                setProcessing(false);
            } else if (response.data.processing) {
                setProcessing(true); // Set processing to true when still processing
                setErrorMessage(null); // Clear the error message
                setResultNotFoundError(false);
            } else {
                setMLResult({
                    prediction: response.data.prediction,
                    rf_probability: response.data.rf_probability,
                    nn_prediction: response.data.nn_prediction,
                });
                setSearchResult(true);
                setProcessing(false); // Set processing to false when done
                setResultNotFoundError(false);
            }
        } catch (error: any) {
            console.error(error);
            setErrorMessage('An unknown error occurred while fetching the result.');
            setProcessing(false);
            setResultNotFoundError(false);
        }
    };




    return {
        selectedFile,
        mlResult,
        errorMessage,
        uniqueKey,
        uploadProgress,
        resultId,
        searchResult,
        processing,
        handleFileSelect,
        handleFileUpload,
        handleSearchResult,
        fileSizeLimit,
        uploadFileSizeLimit,
        uploadButtonDisabled,
        resultAreaRef,
        resultNotFoundError,
    };
};
