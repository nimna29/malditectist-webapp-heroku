import React from 'react';
import './styles.css';

interface CustomMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const CustomMenu: React.FC<CustomMenuProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="menu-overlay" onClick={onClose}>
            <div className="menu-container" onClick={(e) => e.stopPropagation()}>
                <a href="https://www.malditectist.com/" className="menu-item" onClick={onClose}>HOME</a>
                <a href="https://www.malditectist.com/" className="menu-item" onClick={onClose}>ABOUT</a>
                <a href="https://www.malditectist.com/" className="menu-item" onClick={onClose}>FEEDBACK</a>
                <a href="https://www.malditectist.com/" className="menu-item" onClick={onClose}>TERMS &amp; CONDITIONS</a>
            </div>
        </div>
    );
};

export default CustomMenu;
