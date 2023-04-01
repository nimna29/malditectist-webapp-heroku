import React, { useState, useEffect } from 'react';
import Dropzone from 'react-dropzone';
import { useFileUpload } from './useFileUpload';
import './styles.css';
import CustomMenu from './CustomMenu';

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
        resultAreaRef,
        currentYear,
    } = useFileUpload();

    const [isHovering, setIsHovering] = useState(false);

    // Add a new state for controlling the CustomMenu visibility
    const [menuOpen, setMenuOpen] = useState(false);

    // Function to toggle the CustomMenu
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    function calculateStrokeDasharray(value: string) {
        const percentage = Math.round(parseFloat(value));
        return `${percentage}, 100`;
    }

    function getStrokeColor(value: string) {
        const percentage = Math.round(parseFloat(value));
        if (percentage >= 90) {
            return "#FF0000";
        } else if (percentage >= 85 && percentage < 90) {
            return "#E6D305";
        } else {
            return "#04D300";
        }
    }

    useEffect(() => {
        if (uploadProgress !== 0 || mlResult || resultId || errorMessage) {
            resultAreaRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }, [uploadProgress, mlResult, resultId, errorMessage, resultAreaRef]);



    return (
        <>
            <div className='page-content'>
                <CustomMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
                <nav>
                    <a href="https://www.malditectist.com/" className="logo">
                        <span className="visually-hidden">MalDitectist Home</span>
                    </a>
                    <div className="menu-icon" onClick={toggleMenu}></div>
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
                    <div className='result-area' ref={resultAreaRef}>
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
                                            }>File is a {mlResult.prediction}</p>
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
                                                        stroke-dasharray={calculateStrokeDasharray(mlResult.rf_probability)}
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
                                                        stroke-dasharray={calculateStrokeDasharray(mlResult.nn_prediction)}
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
                            )}

                        </div>
                    </div>
                    <div className="about-the-project">
                        <p className='topics'>Why Use MALDITECTIST ?</p>
                        <p className="topics-content">
                            This project aims to develop an AI and Machine Learning-based Malware Detection model to protect
                            computer systems from malware attacks. The model will combine signature-based and anomaly-based
                            detection techniques and will be trained using a unique classified dataset.
                            This project aims to develop an AI and Machine Learning-based Malware Detection model to protect
                            computer systems from malware attacks. The model will combine signature-based and anomaly-based
                            detection techniques and will be trained using a unique classified dataset.
                        </p>
                        <p className='topics'>What is the importance of scanning files ?</p>
                        <p className="topics-content">
                            This project aims to develop an AI and Machine Learning-based Malware Detection model to protect
                            computer systems from malware attacks. The model will combine signature-based and anomaly-based
                            detection techniques and will be trained using a unique classified dataset.
                            This project aims to develop an AI and Machine Learning-based Malware Detection model to protect
                            computer systems from malware attacks. The model will combine signature-based and anomaly-based
                            detection techniques and will be trained using a unique classified dataset.
                        </p>
                    </div>
                    <div className="technologies-used">
                        <div className="technologies-used-heading-text">Technologies Used</div>
                        <div className="technologies-used-content-area">
                            <div className="technologies-used-icon-area">
                                <div className="heroku-logo"></div>
                                <div className="python-logo"></div>
                                <div className="django-logo"></div>
                                <div className="anaconda-logo"></div>
                                <div className="react-logo"></div>
                                <div className="ts-logo"></div>
                                <div className="firebase-logo"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer">
                <div className="follow-for-more">
                    <div className="follow-for-more-text">Follow For More Projects</div>
                    <div className="follow-for-more-icons">
                        <a href="https://github.com/nimna29" className="github-logo">
                            <span className="visually-hidden">GitHub profile</span>
                            </a>
                        <a href="https://www.linkedin.com/in/nimna-niwarthana-4b7357207/" className="linkedin-logo">
                            <span className="visually-hidden">LinkedIn profile</span>
                        </a>
                    </div>
                </div>
                <div className="end-of-footer">
                    <nav className="footer-menu">
                        <ul className="footer-menu-text">
                            <li><a href="https://www.malditectist.com/">HOME</a></li>
                            <li><a href="https://www.malditectist.com/">ABOUT</a></li>
                            <li><a href="https://www.malditectist.com/">FEEDBACK</a></li>
                            <li><a href="https://www.malditectist.com/">TERMS & CONDITIONS</a></li>
                        </ul>
                    </nav>
                    <div className="footer-end">
                        <p className="footer-end-text">
                            © {currentYear} Nimna Niwarthana - All rights reserved <br />
                            &lt;/&gt; WITH ❤️ BY Nimna Niwarthana - Final Year Project 2023
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FileUpload;  
