import React from 'react';
import "./TechnologiesUsed.css"

const TechnologiesUsed: React.FC = () => {
    return (
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
    );
};

export default TechnologiesUsed;
