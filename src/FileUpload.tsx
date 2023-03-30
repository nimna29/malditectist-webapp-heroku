import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import { useFileUpload } from './useFileUpload';
import './styles.css';

const FileUpload = () => {
    const {
        selectedFile,
        mlResult,
        errorMessage,
        uploadProgress,
        resultId,
        searchResult,
        processing,
        handleFileSelect,
        handleFileUpload,
        handleSearchResult,
        fileSizeLimit,
        uploadButtonDisabled,
    } = useFileUpload();

    const [isHovering, setIsHovering] = useState(false);

    return (
        <>
            <div className='page-content'>
                <nav>
                    <a href="https://www.malditectist.com/" className="logo">
                        <span className="visually-hidden">MalDitectist Home</span>
                    </a>
                    <div className="menu-icon"></div>
                </nav>
                <div className='top-content-area'>
                    <div className="steps-and-description">
                        <p className="steps-and-description__description">
                            This project aims to develop an AI and Machine Learning-based Malware Detection model to protect
                            computer systems from malware attacks. The model will combine signature-based and anomaly-based
                            detection techniques and will be trained using a unique classified dataset.
                        </p>
                        <div className="steps-and-description__step steps-and-description__step--1">
                            <span className="steps-and-description__step-title">Step 1 : </span>
                            <span className="steps-and-description__step-content">Select the file or drop the file</span>
                        </div>
                        <div className="steps-and-description__step steps-and-description__step--2">
                            <span className="steps-and-description__step-title">Step 2 : </span>
                            <span className="steps-and-description__step-content">Upload the file and wait for the processing</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="file-select">
                        <div className="file-select__border">
                            <div className="dropzone-container">
                                <button onClick={handleFileUpload} disabled={uploadButtonDisabled || !selectedFile} className={`upload-button ${selectedFile ? 'active' : 'disabled'}`}>
                                    <span className={`upload-icon ${selectedFile ? 'active' : 'disabled'}`} />
                                    Upload File
                                </button>
                                <Dropzone onDrop={handleFileSelect}
                                    onDragEnter={() => setIsHovering(true)}
                                    onDragLeave={() => setIsHovering(false)}>
                                    {({ getRootProps, getInputProps }) => (
                                        <section className={`drop-zone ${isHovering ? 'hover' : ''} ${selectedFile ? 'selected' : ''}`}
                                            {...getRootProps()}>
                                            <input {...getInputProps()} />
                                            <div className="drop-zone__icon-and-text">
                                                <div className="add-file-icon" />
                                                {selectedFile ? (
                                                    <p className="drop-zone__text">Selected File: {selectedFile.name}</p>
                                                ) : (
                                                    <p className="drop-zone__text">Drop a file here, or Click to select a file
                                                        <br /> ( Only .exe files are supported )
                                                    </p>
                                                )}
                                            </div>
                                        </section>
                                    )}
                                </Dropzone>
                            </div>
                        </div>
                    </div>
                    <div className='result-area'>
                        <p className='result-title'>Result</p>
                        <div className='result-box'>
                            {resultId && !searchResult && (
                                <>
                                    <div className='search-result-content'>
                                        <span className='warning-icon' />
                                        <p className='search-result-text'>
                                            The file size is more than {fileSizeLimit}MB. Therefore, it will take some time to process.
                                            <br />
                                            Please click on the Search Result to view your result.
                                            <br />
                                            Kindly ensure that you check your results within the next 15 minutes, as they will be removed after that.
                                        </p>
                                    </div>
                                    <div className='search-result'>
                                        <div className='search-container'>
                                            <button onClick={handleSearchResult} className='search-button'>Search Result</button>
                                        </div>
                                    </div>
                                </>
                            )}
                            {errorMessage && !processing && (
                                <div className='error-container'>
                                    <span className='error-icon' />
                                    <p className='error-message-text'>{errorMessage}</p>
                                </div>
                            )}
                            {processing &&
                                <p className='still-processing-text'>Still Processing...! Please wait for a few moment.</p>
                            }

                            {uploadProgress === 0 && !mlResult && !resultId && !errorMessage && (
                                <div className='result-box-content'>
                                    <span className='info-icon' /><br />
                                    <p className='result-box-text'>Upload a file to see the Result</p>
                                </div>
                            )}

                            {uploadProgress === 100 ? (
                                <div className='result-box-content'>
                                    <span className='spinner' />
                                    <p className='process-text'>Processing...!</p>
                                </div>
                            ) : uploadProgress > 0 && (
                                <div className='result-box-content'>
                                    <span className='spinner' />
                                    <p className='uploading-text'>Upload Progress: {uploadProgress}%</p>
                                </div>
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
                </div>
            </div>
        </>
    );
};

export default FileUpload;  
