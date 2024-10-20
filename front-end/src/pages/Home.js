import React, { useState, useEffect } from 'react';
import { Button, Form, ProgressBar, Container, Alert, Table } from 'react-bootstrap';
import axios from 'axios';
import './Home.css';

const Home = () => {
  // state unm
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [moderationResults, setModerationResults] = useState(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/jpg', 
      'video/mp4', 'video/avi', 'video/mkv', 'video/webm'
    ];

    if (file && !allowedTypes.includes(file.type)) {
      setErrorMessage('Unsupported file type. Please upload an image or video.');
      setSelectedFile(null);
      setPreviewUrl(null);
      setShowPreview(false);
    } else {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
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
    if (!selectedFile) {
      setErrorMessage('Please upload a file before scanning.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setIsScanning(true);
    setProgress(0);

    axios
      .post('http://localhost:5001/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const progressPercentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(progressPercentage);
        },
      })
      .then((response) => {
        console.log('Upload successful, job started:', response.data);
        setModerationResults(response.data.moderationResults);
      })
      .catch((error) => {
        console.error('Error scanning content', error.response ? error.response.data : error.message);
        setErrorMessage('Error scanning content.');
      })
      .finally(() => {
        setIsScanning(false);
      });
  };

  const renderModerationResults = () => {
    if (!moderationResults || !Array.isArray(moderationResults.ModerationLabels) || moderationResults.ModerationLabels.length === 0) {
      return (
        <Alert variant="info" className="mt-3">
          No moderation labels found for this content.
        </Alert>
      );
    }

    return (
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Label</th>
            <th>Parent Label</th>
            <th>Confidence</th>
            <th>Timestamp</th> {/* Only applicable for video */}
          </tr>
        </thead>
        <tbody>
          {moderationResults.ModerationLabels.map((result, index) => {
            const label = result.ModerationLabel?.Name || 'Unknown'; // Safe access with optional chaining
            const parentName = result.ModerationLabel?.ParentName || 'N/A';
            const confidence = result.ModerationLabel?.Confidence !== undefined ? `${result.ModerationLabel.Confidence.toFixed(2)}%` : 'N/A';
            const timestamp = result.Timestamp !== undefined ? new Date(result.Timestamp).toISOString().substr(11, 8) : 'N/A'; // For videos

            return (
              <tr key={index}>
                <td>{label}</td>
                <td>{parentName}</td>
                <td>{confidence}</td>
                <td>{timestamp}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
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
          {selectedFile.type.startsWith('image/') ? (
            <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '400px' }} />
          ) : (
            <video src={previewUrl} controls style={{ maxWidth: '100%', maxHeight: '400px' }} />
          )}
        </div>
      )}

      {progress > 0 && (
        <ProgressBar now={progress} label={`${progress}%`} className="progress mt-3" />
      )}

      {renderModerationResults()}
    </Container>
  );
};

export default Home;
