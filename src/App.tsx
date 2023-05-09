import React, { useState, useEffect } from 'react';
import Preloader from './components/Preloader/Preloader';
import FileUpload from './components/FileUpload/FileUpload';

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
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
