const express = require('express');
const cors = require('cors');
const multer = require('multer');
const AWS = require('aws-sdk');

const app = express();
const PORT = process.env.PORT || 5001;
require('dotenv').config();

const awsAccessKey = process.env.***REMOVED***;
const awsSecretKey = process.env.***REMOVED***;


// AWS Configuration
AWS.config.update({
  accessKeyId: process.env.***REMOVED***,     // Replace with your Access Key ID
  secretAccessKey: process.env.***REMOVED***, // Replace with your Secret Access Key
  region:process.env.AWS_REGION, // e.g., 'us-east-1'
});

const s3 = new AWS.S3();
const rekognition = new AWS.Rekognition();

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// API endpoint to upload and moderate file
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.file;
    const fileName = Date.now() + '-' + file.originalname;

    // Upload file to S3
    const uploadResult = await s3
      .upload({
        Bucket: 'my-content-moderation-bucket-2', // Replace with your bucket name
        Key: fileName,
        Body: file.buffer,
      })
      .promise();

    // Perform content moderation
    let moderationResults;

    if (file.mimetype.startsWith('image/')) {
      // Image moderation
      moderationResults = await moderateImage(fileName);
    } else if (file.mimetype.startsWith('video/')) {
      // Video moderation
      moderationResults = await moderateVideo(fileName);
    } else {
      throw new Error('Unsupported file type.');
    }

    // Optionally delete the file from S3 after processing
    await s3
      .deleteObject({
        Bucket: 'my-content-moderation-bucket-2',
        Key: fileName,
      })
      .promise();

    res.status(200).json({
      message: 'Content moderation completed successfully.',
      moderationResults,
    });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ message: 'Error processing file', error });
  }
});

// Function to moderate images
async function moderateImage(key) {
  const params = {
    Image: {
      S3Object: {
        Bucket: 'my-content-moderation-bucket-2',
        Name: key,
      },
    },
    MinConfidence: 70,
  };

  const data = await rekognition.detectModerationLabels(params).promise();
  return data;
}

// Function to moderate videos (simplified)
async function moderateVideo(key) {
  const params = {
    Video: {
      S3Object: {
        Bucket: 'my-content-moderation-bucket-2',
        Name: key,
      },
    },
    NotificationChannel: {
      RoleArn: process.env.REK_ROLE_ARN,      // Replace with your IAM Role ARN
      SNSTopicArn: process.env.SNS_TOPIC_ARN, // Replace with your SNS Topic ARN
    },
  };

  const response = await rekognition.startContentModeration(params).promise();
  const jobId = response.JobId;

  // Poll for job completion (simplified for demonstration)
  let jobStatus = 'IN_PROGRESS';
  let moderationResults;

  while (jobStatus === 'IN_PROGRESS') {
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds

    const result = await rekognition
      .getContentModeration({ JobId: jobId })
      .promise();

    jobStatus = result.JobStatus;

    if (jobStatus === 'SUCCEEDED') {
      moderationResults = result;
    } else if (jobStatus === 'FAILED') {
      throw new Error('Video moderation failed.');
    }
  }

  return moderationResults;
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
