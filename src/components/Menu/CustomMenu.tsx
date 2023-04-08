/* A React component for App Menu */
import React from 'react';
import './CutomeMenu.css';

interface CustomMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const CustomMenu: React.FC<CustomMenuProps> = ({ isOpen, onClose }) => {
  const handleClose = () => {
    onClose();
    document.body.classList.remove('no-scroll');
  };

  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className="menu-overlay" onClick={handleClose}>
          <div className="menu-container" onClick={(e) => e.stopPropagation()}>
            <a href="https://www.malditectist.com/" className="menu-item" onClick={handleClose}>
              HOME
            </a>
            <a href="https://www.malditectist.com/" className="menu-item" onClick={handleClose}>
              ABOUT
            </a>
            <a href="https://forms.gle/8xXmTnVY3yGbAVWP8 " className="menu-item" onClick={handleClose} target="_blank" rel="noopener noreferrer">
              FEEDBACK
            </a>
            <a href="https://www.malditectist.com/" className="menu-item" onClick={handleClose}>
              TERMS &amp; CONDITIONS
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomMenu;
