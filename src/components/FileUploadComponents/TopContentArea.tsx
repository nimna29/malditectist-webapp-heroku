import React from 'react';
import './TopContentArea.css';

const TopContentArea: React.FC = () => {
    return (
        <div className='top-content-area'>
            <div className="steps-and-description">
                <p className="steps-and-description__description">
                    Welcome to MalDitectist, an innovative project that utilizes AI and Machine Learning to develop an advanced Malware Detection model.
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
    );
};

export default TopContentArea;