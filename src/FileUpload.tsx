import React, { useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import Dropzone from 'react-dropzone';

interface MlResult {
    prediction: string;
    rf_probability: string;
    nn_prediction: string;
}

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
    const [mlResult, setMLResult] = useState<MlResult | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [uniqueKey, setUniqueKey] = useState<string>(Date.now().toString());
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [resultId, setResultId] = useState<string | null>(null);

    const handleFileSelect = (file: File[]) => {
        setSelectedFile(file[0]);
        setErrorMessage(null);
        setMLResult(null);
        setUniqueKey(Date.now().toString());
        setUploadProgress(0);
        setResultId(null);
    };

    const handleFileUpload = async () => {
        if (selectedFile === undefined) {
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('unique_key', uniqueKey);

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
            const apiUrl = isProduction ? '/api/upload_file/' : 'http://localhost:8000/api/upload_file/';

            const response = await axios.post(
                apiUrl,
                formData,
                config
            );
            setMLResult({
                prediction: response.data.prediction,
                rf_probability: response.data.rf_probability,
                nn_prediction: response.data.nn_prediction,
            });
            setResultId(null);
        } catch (error: any) {
            console.error(error);
            if (error.response && error.response.status === 400) {
                setErrorMessage(error.response.data.error);
            } else if (error.response && error.response.status === 408) {
                setResultId(error.response.data.result_id);
                setErrorMessage('Process will take some time. This is your Result ID: ' + error.response.data.result_id + '');
            } else {
                setErrorMessage('An error occurred while uploading the file.');
            }
        } finally {
            setUploadProgress(0);
        }
    };

    const handleSearchResult = async () => {
        if (!resultId) {
            return;
        }

        try {
            const isProduction = process.env.NODE_ENV === 'production';
            const apiUrl = isProduction ? `/api/get_result/${resultId}/` : `http://localhost:8000/api/get_result/${resultId}/`;

            const response = await axios.get(apiUrl);

            if (response.status === 200) {
                setMLResult({
                    prediction: response.data.prediction,
                    rf_probability: response.data.rf_probability,
                    nn_prediction: response.data.nn_prediction,
                });
                setErrorMessage(null);
            } else if (response.status === 202) {
                setErrorMessage('Still Processing... Please try again later in a few seconds.');
            }
        } catch (error: any) {
            console.error(error);
            if (error.response && error.response.status === 404) {
                setErrorMessage('Result not found. Please make sure the Result ID is correct.');
            } else {
                setErrorMessage('An error occurred while fetching the result.');
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
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <div>
                {uploadProgress === 100 ? (
                    <p>Processing...!</p>
                ) : uploadProgress > 0 && (
                    <p>Upload progress: {uploadProgress}%</p>
                )}
                {mlResult && (
                    <>
                        <p>Prediction: {mlResult.prediction}</p>
                        <p>Random Forest Probability: {mlResult.rf_probability}</p>
                        <p>Neural Network Prediction: {mlResult.nn_prediction}</p>
                        <p>If the probability and prediction values are close to 100%,
                            it indicates that the file is a malware.<br />
                            Conversely, if the probability and prediction values are below 85%,
                            it indicates that the file is not a malware and is a legitimate file.</p>
                    </>
                )}
            </div>
            {!mlResult && resultId && (
                <div>
                    <input
                        type="text"
                        value={resultId}
                        readOnly
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <button onClick={handleSearchResult}>Search Result</button>
                </div>
            )}
        </div>
    );
};

export default FileUpload;

