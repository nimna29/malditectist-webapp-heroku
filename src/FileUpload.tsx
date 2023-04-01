/**
 * The function is a React component that renders a file upload form and displays the result of the
 * file upload.
 * @returns The return value is a React component.
 */
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
        uploadFileSizeLimit,
        uploadButtonDisabled,
        resultAreaRef,
        currentYear,
    } = useFileUpload();


    const [isHovering, setIsHovering] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
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
                            Welcome to Malditectist, an innovative project that utilizes AI and Machine Learning to develop an advanced Malware Detection model.
                            The model integrated signature-based and anomaly-based detection techniques and
                            was trained using a unique classified PE file dataset.
                            The project aims to provide a solution for computer systems to protect them from malware attacks.
                        </p>
                        <div className="steps-and-description__step steps-and-description__step--1">
                            <span className="steps-and-description__step-title">Step 1 : </span>
                            <span className="steps-and-description__step-content">Select or drop your file in the below area, 
                            and click the "Upload File" button.</span>
                        </div>
                        <div className="steps-and-description__step steps-and-description__step--2">
                            <span className="steps-and-description__step-title">Step 2 : </span>
                            <span className="steps-and-description__step-content">Please wait until the file is uploaded and the process is complete.</span>
                        </div>
                        <div className="steps-and-description__step steps-and-description__step--3">
                            <span className="steps-and-description__step-title">Step 3 : </span>
                            <span className="steps-and-description__step-content">Once the process is complete, 
                            the result will be displayed under the "Result" section.</span>
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
                            {resultId && !searchResult && (
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
                            )}
                        </div>
                    </div>
                    <div className="about-the-project">
                        <p className='topics'>What is MALDITECTIST ?</p>
                        <p className="topics-content">
                        Malditectist is an advanced Malware Detection application that utilizes AI and Machine Learning 
                        to identify known and unknown malware accurately. ML models use signature-based and anomaly-based 
                        detection techniques and have been trained using a unique classified PE (Portable Excitable) file dataset. 
                        Using Malditectist, users can protect their computer systems and networks from malware attacks and 
                        reduce the risk of data breaches and IT operation disruptions.
                        Please note that this research project application is hosted using Heroku's basic plan, 
                        which may result in occasional service disruptions if the server bandwidth exceeds. 
                        I apologize for any inconvenience this may cause. Additionally, Malditectist does not 
                        store any user data on the servers. Files and result data will be deleted once the user 
                        receives the results on the web page. The application does not collect any user data, ensuring complete user privacy.
                        Malditectist is an open-source project; users can access the source code on 
                        <a href="https://github.com/nimna29/malditectist-webapp-heroku" target="_blank" rel="noopener noreferrer"> GitHub</a> when it becomes available. 
                        Thank you for considering Malditectist in your fight against malware.
                        </p>
                        <p className='topics'>What is the importance of scanning files ?</p>
                        <p className="topics-content">
                        Scanning files is crucial in ensuring the safety and security of your computer system and network. 
                        Malware can infiltrate your system through various channels, including email attachments, downloads, 
                        and external storage devices. Once malware infects your system, it can cause significant damage, 
                        including stealing personal data, destroying files, and compromising network security.
                        By scanning your files with a reliable malware detection application like Malditectist, 
                        you can identify any potential threats and prevent them from causing harm to your system. 
                        The application uses advanced AI and Machine Learning techniques to detect malware with high accuracy, 
                        reducing the risk of false positives and false negatives. It is important to scan all files, especially 
                        those downloaded from the internet or received from an unknown source, to reduce the risk of malware infections. 
                        Regularly scanning your files ensures the safety and security of your computer system and network. By doing so, 
                        you can protect your personal and sensitive data, maintain the performance and efficiency of your system, 
                        and prevent disruptions in your IT operations.
                        </p>
                        <p className='topics'>Limitations of This Research Project</p>
                        <p className="topics-content">
                        While Malditectist is an advanced Malware Detection application, 
                        users should be aware of some limitations to this research project. 
                        These limitations include:
                        </p>
                        <ul className="topics-content-points">
                            <li>Currently, the application only supports Windows PE (Portable Executable) files.</li>
                            <li>Heroku hosting service is limited to the Basic Plan, which may cause 
                                occasional disruptions if the server bandwidth exceeds.</li>
                            <li>File upload size is limited to 100MB because the app uses Firebase Free Plan, 
                                which has only 1GB daily bandwidth.</li>
                            <li>Sometimes Malditectist may give false results due to the limitations of the trained Portable Executables dataset. 
                                The current dataset only included PE files in 2018, and the PE file structure has changed in recent years (2023). 
                                The models will be retrained with new PE files and increased features to improve accuracy.</li>
                        </ul>
                        <p className="topics-content">
                        It's important to note that while these limitations exist, 
                        I am continuously working on improving the application's performance and accuracy. 
                        Please provide feedback about the application. It will help to improve this application.
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
                        <a href="https://github.com/nimna29" className="github-logo" target="_blank" rel="noopener noreferrer">
                            <span className="visually-hidden">GitHub profile</span>
                        </a>
                        <a href="https://www.linkedin.com/in/nimna-niwarthana-4b7357207/" className="linkedin-logo" target="_blank" rel="noopener noreferrer">
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
