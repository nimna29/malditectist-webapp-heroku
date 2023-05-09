import React from 'react';
import './Preloader.css';

const Preloader: React.FC = () => {
    return (
        <div className="preloader">
            <div className="spinner-box">
                <div className="spinner" />
            </div>
        </div>
    );
};

export default Preloader;
