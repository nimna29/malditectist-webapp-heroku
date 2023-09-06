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

# For Development Environment
## Prerequisites

Before you begin, ensure you have met the following requirements:

- Python 3.9 or above installed
- Node.js and npm (Node Package Manager) installed

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
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate

# On macOS and Linux:
source venv/bin/activate
```
##### Using conda (if you have Anaconda or Miniconda installed):

```
# Create a conda environment with Python 3.9
conda create --name my-env python=3.9

# Activate the conda environment
conda activate my-env
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

### 5. Run the Project
Now, you can start both the Python backend and the Node.js frontend in separate terminals.
- Start the Django development server
```
python manage.py runserver
```

- Start the React development server
```
npm start
```