import React from 'react';
import "./AboutTheProject.css";

const AboutTheProject: React.FC = () => {
    return (
        <div className="about-the-project">
            <p className='topics'>What is MALDITECTIST ?</p>
            <p className="topics-content">
                MalDitectist is an advanced Malware Detection application that utilizes AI and Machine Learning
                to identify known and unknown malware accurately. ML models use signature-based and anomaly-based
                detection techniques and have been trained using a unique classified PE (Portable Excitable) file dataset.
                Using MalDitectist, users can protect their computer systems and networks from malware attacks and
                reduce the risk of data breaches and IT operation disruptions.
                Please note that this research project application is hosted using Heroku's basic plan,
                which may result in occasional service disruptions if the server bandwidth exceeds.
                I apologize for any inconvenience this may cause. Additionally, MalDitectist does not
                store any user data on the servers. Files and result data will be deleted once the user
                receives the results on the web page. The application does not collect any user data, ensuring complete user privacy.
                MalDitectist is an open-source project; users can access the source code on
                <a href="https://github.com/nimna29/malditectist-webapp-heroku" target="_blank" rel="noopener noreferrer"> GitHub</a> when it becomes available.
                Thank you for considering MalDitectist in your fight against malware.
            </p>
            <p className='topics'>What is the importance of scanning files ?</p>
            <p className="topics-content">
                Scanning files is crucial in ensuring the safety and security of your computer system and network.
                Malware can infiltrate your system through various channels, including email attachments, downloads,
                and external storage devices. Once malware infects your system, it can cause significant damage,
                including stealing personal data, destroying files, and compromising network security.
                By scanning your files with a reliable malware detection application like MalDitectist,
                you can identify any potential threats and prevent them from causing harm to your system.
                The application uses advanced AI and Machine Learning techniques to detect malware with high accuracy,
                reducing the risk of false positives and false negatives. It is important to scan all files, especially
                those downloaded from the internet or received from an unknown source, to reduce the risk of malware infections.
                Regularly scanning your files ensures the safety and security of your computer system and network. By doing so,
                you can protect your personal and sensitive data, maintain the performance and efficiency of your system,
                and prevent disruptions in your IT operations.
            </p>
            <p className='topics'>Limitations of This Research Project</p>
            <p className="topics-content">
                While MalDitectist is an advanced Malware Detection application,
                users should be aware of some limitations to this research project.
                These limitations include:
            </p>
            <ul className="topics-content-points">
                <li>Currently, the application only supports Windows PE (Portable Executable) files.</li>
                <li>Heroku hosting service is limited to the Basic Plan, which may cause
                    occasional disruptions if the server bandwidth exceeds.</li>
                <li>File upload size is limited to 100MB because the app uses Firebase Free Plan,
                    which has only 1GB daily bandwidth.</li>
                <li>Sometimes MalDitectist may give false results due to the limitations of the trained Portable Executables dataset.
                    The current dataset only included PE files in 2018, and the PE file structure has changed in recent years (2023).
                    The models will be retrained with new PE files and increased features to improve accuracy.</li>
            </ul>
            <p className="topics-content">
                It's important to note that while these limitations exist,
                I am continuously working on improving the application's performance and accuracy.
                Please provide feedback about the application. It will help to improve this application.
            </p>
        </div>
    );
};

export default AboutTheProject;
