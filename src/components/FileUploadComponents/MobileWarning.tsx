import React from 'react';
import "./MobileWarning.css";

const MobileWarning: React.FC = () => {
    return (
        <div id="mobile-warning" className="mobile-warning">
            <div className="mobile-warning-content">
                <div className="warning-icon" />
                <p className="warning-text">
                    This web app is designed for desktop use only. For the best experience,
                    please switch to Desktop Site mode in your mobile browser.
                </p>
            </div>
        </div>
    );
};

export default MobileWarning;