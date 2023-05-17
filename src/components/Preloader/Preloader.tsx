import React from 'react';
import './Preloader.css';

const Preloader: React.FC = () => {
    return (
        <div className="preloader" data-testid="preloader">
            <div className="malditectist-logo-icon" />
            <div className="pre-spinner">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    );
};

export default Preloader;
