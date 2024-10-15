import React, { useState } from 'react';
import { Button, Form, ProgressBar, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleGoogleDrivePicker = () => {
    const developerKey = 'YOUR_GOOGLE_DEVELOPER_KEY';
    const clientId = 'YOUR_GOOGLE_CLIENT_ID';
    const scope = ['https://www.googleapis.com/auth/drive.file'];
    const pickerApiLoaded = false;
    const oauthToken = null;

    // Load the Picker API library
    window.gapi.load('auth', { 'callback': onAuthApiLoad });
    window.gapi.load('picker', { 'callback': onPickerApiLoad });

    function onAuthApiLoad() {
      window.gapi.auth.authorize(
        {
          client_id: clientId,
          scope: scope,
          immediate: false
        },
        handleAuthResult
      );
    }

    function onPickerApiLoad() {
      pickerApiLoaded = true;
      createPicker();
    }

    function handleAuthResult(authResult) {
      if (authResult && !authResult.error) {
        oauthToken = authResult.access_token;
        createPicker();
      }
    }

    function createPicker() {
      if (pickerApiLoaded && oauthToken) {
        const picker = new window.google.picker.PickerBuilder()
          .addView(window.google.picker.ViewId.DOCS)
          .setOAuthToken(oauthToken)
          .setDeveloperKey(developerKey)
          .setCallback(pickerCallback)
          .build();
        picker.setVisible(true);
      }
    }

    function pickerCallback(data) {
      if (data.action === window.google.picker.Action.PICKED) {
        const fileId = data.docs[0].id;
        const fileUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&access_token=${oauthToken}`;
        setSelectedFile(fileUrl);
        setPreviewUrl(fileUrl);
      }
    }
  };

  const handleDropboxPicker = () => {
    const options = {
      success: function (files) {
        setSelectedFile(files[0].link);
        setPreviewUrl(files[0].link);
      },
      cancel: function () {},
      linkType: 'preview', // or 'direct'
      multiselect: false,
      extensions: ['.pdf', '.doc', '.png', '.jpg', '.jpeg', '.gif', '.mp4'],
    };
    window.Dropbox.choose(options);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'video/mp4', 'video/avi', 'video/mkv', 'video/webm'];

    if (file && !allowedTypes.includes(file.type)) {
      setErrorMessage('Unsupported file type. Please upload an image or video.');
      setSelectedFile(null);
      setPreviewUrl(null);
      setShowPreview(false);
    } else {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setShowPreview(false);
      setErrorMessage('');
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleScan = () => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    setIsScanning(true);

    axios
      .post('YOUR_AWS_BACKEND_URL', formData, {
        onUploadProgress: (progressEvent) => {
          const progressPercentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(progressPercentage);
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error scanning content', error);
      })
      .finally(() => {
        setIsScanning(false);
      });
  };

  return (
    <Container className="container">
      <h2>Upload and Preview Content</h2>

      <Form>
        <Form.Group controlId="formFile">
          <Form.Label>Upload a Video or Image</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} className="form-control" />
        </Form.Group>
      </Form>

      <div className="cloud-buttons">
        <Button onClick={handleGoogleDrivePicker}>Upload from Google Drive</Button>
        <Button onClick={handleDropboxPicker}>Upload from Dropbox</Button>
      </div>

      {errorMessage && (
        <Alert variant="danger" className="mt-3">
          {errorMessage}
        </Alert>
      )}

      {selectedFile && !errorMessage && (
        <div className="button-group">
          <Button variant="secondary" onClick={handlePreview}>
            Preview
          </Button>

          <Button
            variant="primary"
            className="btn-scan"
            onClick={handleScan}
            disabled={isScanning || !selectedFile}
          >
            {isScanning ? 'Scanning...' : 'Scan'}
          </Button>
        </div>
      )}

      {showPreview && previewUrl && (
        <div className="preview-container mt-3">
          {selectedFile.type?.startsWith('image/') ? (
            <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '400px' }} />
          ) : (
            <video src={previewUrl} controls style={{ maxWidth: '100%', maxHeight: '400px' }} />
          )}
        </div>
      )}

      {progress > 0 && (
        <ProgressBar now={progress} label={`${progress}%`} className="progress mt-3" />
      )}
    </Container>
  );
};

export default Home;
