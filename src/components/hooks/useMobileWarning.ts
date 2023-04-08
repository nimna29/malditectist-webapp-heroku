import { useEffect } from 'react';
import isMobile from '../utils/isMobile';

const useMobileWarning = () => {
  useEffect(() => {
    const checkAndHideMessage = () => {
      if (isMobile()) {
        const mobileWarning = document.getElementById('mobile-warning');
        if (mobileWarning) {
          window.addEventListener('resize', () => {
            if (window.innerWidth > 767) {
              mobileWarning.classList.add('mobile-warning-hidden');
            } else {
              mobileWarning.classList.remove('mobile-warning-hidden');
            }
          });
        }
      }
    };
    checkAndHideMessage();
  }, []);
};

export default useMobileWarning;