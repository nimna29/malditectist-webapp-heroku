import Dropzone from 'react-dropzone';
import { useFileUpload } from './useFileUpload';

const FileUpload = () => {
    const {
        selectedFile,
        mlResult,
        errorMessage,
        uploadProgress,
        resultId,
        searchResult,
        processing,
        handleFileSelect,
        handleFileUpload,
        handleSearchResult,
        fileSizeLimit,
    } = useFileUpload();


    return (
        <div>
            <Dropzone onDrop={handleFileSelect}>
                {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        {selectedFile ? (
                            <p>Selected file: {selectedFile.name}</p>
                        ) : (
                            <p>Drag and drop a file here, or click to select a file</p>
                        )}
                    </div>
                )}
            </Dropzone>
            <button onClick={handleFileUpload} disabled={!selectedFile}>
                Upload
            </button>
            {resultId && !searchResult && (
                <>
                    <p>
                        The file size is more than {fileSizeLimit}MB. Therefore, it will take some time to process.
                        <br />
                        Please click on the Search Result to view your result.
                        <br />
                        Kindly ensure that you check your results within the next 15 minutes, as they will be removed after that.
                    </p>
                    <br />
                    <input
                        type="text"
                        readOnly
                        value={resultId}
                        style={{ marginRight: '10px' }}
                    />
                    <button onClick={handleSearchResult}>Search Result</button>
                </>
            )}
            {errorMessage && !processing && <p style={{ color: '#BB0000' }}>{errorMessage}</p>}
            {processing && <p style={{ color: '#29ABE2' }}>Still Processing...! Please wait for a few moments.</p>}

            <div>
                {uploadProgress === 100 ? (
                    <p>Processing...!</p>
                ) : uploadProgress > 0 && (
                    <p>Upload Progress: {uploadProgress}%</p>
                )}
                {mlResult && (
                    <>
                        <p>Prediction: {mlResult.prediction}</p>
                        <p>Random Forest Probability: {mlResult.rf_probability}</p>
                        <p>Neural Network Prediction: {mlResult.nn_prediction}</p>
                        <p>
                            If the probability and prediction values are close to 100%, it indicates
                            that the file is a malware.
                            <br />
                            Conversely, if the probability and prediction values are below 85%, it
                            indicates that the file is not a malware and is a legitimate file.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default FileUpload;  
