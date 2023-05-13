import React, { useState, useEffect } from 'react';
import Preloader from './components/Preloader/Preloader';
import FileUpload from './components/FileUpload/FileUpload';

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace the current entry on the history stack.
    window.history.replaceState({ ...window.history.state, scrollToTop: true }, '');

    const timer = setTimeout(() => {
      setLoading(false);
      // Scroll to the top if the state object is present.
      if (window.history.state?.scrollToTop) {
        window.scrollTo(0, 0);
      }
    }, 2000); // (in milliseconds)

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div>
      {loading && <Preloader />}
      <FileUpload />
    </div>
  );
};

export default App;
