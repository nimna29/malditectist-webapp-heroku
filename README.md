# MalDitectist - Heroku
## AI and Machine Learning-based Malware  Detection Application
#### Development Of This Repository - Web Application Development
<br>
<p>This project aims to develop an AI and Machine Learning-based Malware Detection model to protect computer systems from malware attacks. The model will combine signature-based and anomaly-based detection techniques and will be trained using a unique classified dataset. A web portal will be developed to provide users with a GUI to interact with the model and upload files to detect malware. The project outcomes include a machine learning model for detecting malware with good accuracy and a user-interactive website to upload files and get detailed reports about malware.</p>


# Welcome to MalDitectist

<p>An innovative project that utilizes AI and Machine Learning to develop an advanced Malware Detection model. The model integrated signature-based and anomaly-based detection techniques and was trained using a unique classified PE file dataset. The project aims to provide a solution for computer systems to protect them from malware attacks.</p>

## `Live Web App`
Check out the [MalDitectist](https://www.malditectist.com/)

## `Model Development Repo`
Check out the [Model Development](https://github.com/nimna29/MalDitectist)

### `License`
This project is licensed under the MIT License. See [LICENSE](https://github.com/nimna29/malditectist-webapp-heroku/blob/main/LICENSE) for more details.

### `Feedback`
Provide a [Feedback](https://forms.gle/KopaHvcjFH5cYV988).

---------------------
# For Development Environment
## Prerequisites

Before you begin, ensure you have met the following requirements:

- Python 3.9 or above installed
- Node.js and npm (Node Package Manager) installed
  
  ```
      "engines": {
        "node": "18.17.1",
        "npm": "10.0.0"
    },
  ```

## Setup Instructions

Follow these steps to set up and run the project:

### 1. Python Environment Setup

#### 1.1. Python Installation

Make sure you have Python 3.9 or above installed. You can download Python from the official website: [Python Downloads](https://www.python.org/downloads/).

#### 1.2. Virtual Environment (Optional)

It's recommended to create a virtual environment to isolate project dependencies. You can create one using the built-in `venv` module or `conda`. Here are the steps for both methods:

##### Using venv:

```bash
# Navigate to your project directory
cd /path/to/your/project

# Create a virtual environment
python -m venv <venv_name>

# Activate the virtual environment
# On Windows:
<venv_name>\Scripts\activate

# On macOS and Linux:
source <venv_name>/bin/activate

# On bash:
source <venv_name>/Scripts/activate

# For Deactivate:
deactivate
```
##### Using conda (if you have Anaconda or Miniconda installed):

```bash
# Navigate to your project directory
cd /path/to/your/project

# Create a conda environment with Python 3.9
conda create --name <venv_name>

# Activate the conda environment
conda activate <venv_name>

# For deactivate the conda environment
conda deactivate <venv_name>
```

### 2. Install Python Dependencies
Install the Python packages listed in the `requirements.txt` file:
```
pip install -r requirements.txt
```

### 3. Node.js Environment Setup
Make sure you have Node.js and npm (Node Package Manager) installed. You can download them from the official website: [Node.js Downloads](https://nodejs.org/en/download).

### 4. Install Node.js Dependencies
Install the Node.js packages required for your project:
```
npm install
```
### 5. Setting Up Environment Variables
To configure your project, you'll need to set up environment variables. These variables are typically stored in a `.env` file. Follow these steps to set them up:

#### 5.1. Python Installation:
Create the `.env` File:
- Rename the `env.example` file in your project directory to `.env`.
#### 5.2 Add Environment Variables:
- Open the `.env` file and set the following variables with your actual values:
```plaintext
FIREBASE_STORAGE_BUCKET=<Your Firebase Storage Bucket>
FIREBASE_PROJECT_ID=<Your Firebase Project ID>
FIREBASE_PRIVATE_KEY_ID=<Your Firebase Private Key ID>
FIREBASE_PRIVATE_KEY=<Your Firebase Private Key>
FIREBASE_CLIENT_EMAIL=<Your Firebase Client Email>
FIREBASE_CLIENT_ID=<Your Firebase Client ID>
FIREBASE_AUTH_URI=<Your Firebase Auth URI>
FIREBASE_TOKEN_URI=<Your Firebase Token URI>
FIREBASE_AUTH_PROVIDER_CERT_URL=<Your Firebase Auth Provider Cert URL>
FIREBASE_CLIENT_CERT_URL=<Your Firebase Client Cert URL>

MAX_WORKERS=<The maximum number of concurrent threads that can be simultaneously processed>
REACT_APP_FILE_SIZE_LIMIT=<Small file size limit>
REACT_APP_UPLOAD_FILE_SIZE_LIMIT=<Application-supported max file size upload limit>
DJANGO_SECRET_KEY=<Your Django Secret Key>
DJANGO_DEBUG=<true or false>
```
#### 5.3 Save and Use:
- Save the .env file, and your project will now use these environment variables for configuration.
- Note: Be careful not to share or commit your .env file with sensitive information to version control systems like Git.

### 6. Run the Project
Now, you can start both the Python backend and the Node.js frontend in separate terminals.
- Terminal 1: Start the Django development server
```
python manage.py runserver
```

- Terminal 2: Start the React development server
```
npm start
```
