import React, { useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import Dropzone from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';

interface MlResult {
    prediction: string;
    rf_probability: string;
    nn_prediction: string;
}

let fileSizeLimit: number = Number(process.env.REACT_APP_FILE_SIZE_LIMIT) || 30;

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
    const [mlResult, setMLResult] = useState<MlResult | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [uniqueKey, setUniqueKey] = useState<string>(Date.now().toString());
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [resultId, setResultId] = useState<string | null>(null);
    const [searchResult, setSearchResult] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false);


    const handleFileSelect = (file: File[]) => {
        setSelectedFile(file[0]);
        setErrorMessage(null);
        setMLResult(null);
        setUniqueKey(Date.now().toString());
        setUploadProgress(0);
        setResultId(null);
        setSearchResult(false);
    };

    const handleFileUpload = async () => {
        if (selectedFile === undefined) {
            return;
        }

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

            if (targetApiUrl === largeFileApiUrl) {
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
            } else {
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

            if (response.data.processing) {
                setProcessing(true); // Set processing to true when still processing
                setErrorMessage(null); // Clear the error message
            } else {
                setMLResult({
                    prediction: response.data.prediction,
                    rf_probability: response.data.rf_probability,
                    nn_prediction: response.data.nn_prediction,
                });
                setSearchResult(true);
                setProcessing(false); // Set processing to false when done
            }
        } catch (error: any) {
            console.error(error);
            if (error.response && error.response.status === 404) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage('An unknown error occurred while fetching the result.');
            }
        }
    };


    return (
        <div>
            <Dropzone onDrop={handleFileSelect}>
                {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        {selectedFile ? (
                            <p>Selected file: {selectedFile.name}</p>
                        ) : (
                            <p>Drag and drop a file here, or click to select a file</p>
                        )}
                    </div>
                )}
            </Dropzone>
            <button onClick={handleFileUpload} disabled={!selectedFile}>
                Upload
            </button>
            {resultId && !searchResult && (
                <>
                    <p>
                        The file size is more than {fileSizeLimit}MB. Therefore, it will take some time to process.
                        <br/>
                        Please click on the Search Result to view your result.
                        <br/>
                        Kindly ensure that you check your results within the next 15 minutes, as they will be removed after that.
                    </p>
                    <br/>
                    <input
                        type="text"
                        readOnly
                        value={resultId}
                        style={{ marginRight: '10px' }}
                    />
                    <button onClick={handleSearchResult}>Search Result</button>
                </>
            )}
            {errorMessage && !processing && <p style={{ color: '#BB0000' }}>{errorMessage}</p>}
            {processing && <p style={{ color: '#29ABE2' }}>Still Processing...! Please wait for a few moments.</p>}

            <div>
                {uploadProgress === 100 ? (
                    <p>Processing...!</p>
                ) : uploadProgress > 0 && (
                    <p>Upload Progress: {uploadProgress}%</p>
                )}
                {mlResult && (
                    <>
                        <p>Prediction: {mlResult.prediction}</p>
                        <p>Random Forest Probability: {mlResult.rf_probability}</p>
                        <p>Neural Network Prediction: {mlResult.nn_prediction}</p>
                        <p>
                            If the probability and prediction values are close to 100%, it indicates
                            that the file is a malware.
                            <br />
                            Conversely, if the probability and prediction values are below 85%, it
                            indicates that the file is not a malware and is a legitimate file.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default FileUpload;  
