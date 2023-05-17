import React from 'react';
import Dropzone from 'react-dropzone';
import { useFileUpload } from '../hooks/useFileUpload';
import './FileUpload.css';
import CustomMenu from '../Menu/CustomMenu';
import isMobile from '../utils/isMobile';
import { calculateStrokeDasharray, getStrokeColor } from '../utils/percentageCircle';
import useMobileWarning from '../hooks/useMobileWarning';
import useUIInteractions from '../hooks/useUIInteractions';
import TopContentArea from '../FileUploadComponents/TopContentArea';
import MobileWarning from '../FileUploadComponents/MobileWarning';
import AboutTheProject from '../FileUploadComponents/AboutTheProject';
import Footer from '../FileUploadComponents/Footer';
import TechnologiesUsed from '../FileUploadComponents/TechnologiesUsed';



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
        uploadFileSizeLimit,
        uploadButtonDisabled,
        resultAreaRef,
        resultNotFoundError,
    } = useFileUpload();

    const {
        isHovering,
        setIsHovering,
        menuOpen,
        setMenuOpen,
        toggleMenu,
    } = useUIInteractions({
        uploadProgress,
        mlResult,
        resultId,
        errorMessage,
        resultAreaRef
    });

    useMobileWarning();



    return (
        <div data-testid="file-upload">
            <div className='page-content'>
                <CustomMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
                <nav>
                    <a href="https://www.malditectist.com/" className="logo">
                        <span className="visually-hidden">MalDitectist Home</span>
                    </a>
                    <div className="menu-icon" onClick={toggleMenu}></div>
                </nav>
                {isMobile() && (
                    <MobileWarning />
                )}
                <TopContentArea />
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
                                                        <br /> ( Only .exe files up to {uploadFileSizeLimit}MB are supported )
                                                    </p>
                                                )}
                                            </div>
                                        </section>
                                    )}
                                </Dropzone>
                            </div>
                        </div>
                    </div>
                    <div className='result-area' ref={resultAreaRef}>
                        <p className='result-title'>Result</p>
                        <div className='result-box'>
                            {resultId && !searchResult && !resultNotFoundError && (
                                <>
                                    <div className='search-result-content'>
                                        <span className='warning-icon' />
                                        <p className='search-result-text'>
                                            The file size is more than {fileSizeLimit}MB. Therefore, it will take some time to process.
                                            <br />
                                            Please click on the "Search Result" to view your result.
                                            <br />
                                            Kindly ensure that you check your result within the next 15 minutes, as they will be removed after that.
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
                            {resultNotFoundError && !processing && (
                                <div className='error-container'>
                                    <span className='error-icon' />
                                    <p className='error-message-text'>Result not found or expired.</p>
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

                            {mlResult && mlResult.prediction === "Error occurred while processing the file" ? (
                                <div className='error-container'>
                                    <span className='error-icon' />
                                    <p className='error-message-text'>{mlResult.prediction}</p>
                                </div>
                            ) : (
                                mlResult && (
                                    <div className="ml-result">
                                        <div className="prediction-description">
                                            <div className="legitimate-icon-text-area">
                                                {mlResult.prediction === "Malware" || mlResult.prediction === "Uncertain (mostly Malware)"
                                                    ? (
                                                        <div className="malware-icon" />
                                                    ) : (
                                                        <div className="legitimate-icon" />
                                                    )}
                                                <p className={
                                                    mlResult.prediction === "Malware" || mlResult.prediction === "Uncertain (mostly Malware)"
                                                        ? "malware-text"
                                                        : "legitimate-text"
                                                }>File is {mlResult.prediction}</p>
                                            </div>
                                            <p className="description-text">
                                                If the prediction percentage values are close to 100%, it indicates
                                                that the file is a malware.
                                                <br />
                                                Conversely, if the probability and prediction values are below 85%, it
                                                indicates that the file is not a malware and is a legitimate file.
                                            </p>
                                        </div>
                                        <div className="center-divider"></div>
                                        <div className="percentage-values-area">
                                            <div className="rf-model-value-box">
                                                <div className="single-chart">
                                                    <svg viewBox="0 0 36 36" className="circular-chart blue">
                                                        <path className="circle-bg"
                                                            d="M18 2.0845
                                                        a 15.9155 15.9155 0 0 1 0 31.831
                                                        a 15.9155 15.9155 0 0 1 0 -31.831"
                                                        />
                                                        <path
                                                            className="circle"
                                                            stroke={getStrokeColor(mlResult.rf_probability)}
                                                            strokeDasharray={calculateStrokeDasharray(mlResult.rf_probability)}
                                                            d="M18 2.0845
                                                        a 15.9155 15.9155 0 0 1 0 31.831
                                                        a 15.9155 15.9155 0 0 1 0 -31.831"
                                                        />
                                                        <text x="18" y="20.35" className="percentage">{mlResult.rf_probability}</text>
                                                    </svg>
                                                </div>
                                                <p className="rf-text">Random Forest Model</p>
                                            </div>
                                            <div className="nn-model-value-box">
                                                <div className="single-chart">
                                                    <svg viewBox="0 0 36 36" className="circular-chart blue">
                                                        <path className="circle-bg"
                                                            d="M18 2.0845
                                                        a 15.9155 15.9155 0 0 1 0 31.831
                                                        a 15.9155 15.9155 0 0 1 0 -31.831"
                                                        />
                                                        <path
                                                            className="circle"
                                                            stroke={getStrokeColor(mlResult.nn_prediction)}
                                                            strokeDasharray={calculateStrokeDasharray(mlResult.nn_prediction)}
                                                            d="M18 2.0845
                                                        a 15.9155 15.9155 0 0 1 0 31.831
                                                        a 15.9155 15.9155 0 0 1 0 -31.831"
                                                        />
                                                        <text x="18" y="20.35" className="percentage">{mlResult.nn_prediction}</text>
                                                    </svg>
                                                </div>
                                                <p className="nn-text">Neural Network Model</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                    <AboutTheProject />
                    <TechnologiesUsed />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default FileUpload;  
