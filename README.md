
# Content Moderation System

This is a web application that allows users to upload videos or images and scan them for content moderation using a backend service. The app provides detailed moderation labels for the uploaded content and displays them in a clean and user-friendly interface.

---

## Features

- **Upload Content**: Supports images and video file formats for upload.
- **Preview Uploaded Files**: View uploaded images or play videos before scanning.
- **Content Moderation**: Detects moderation labels such as "Graphic Violence," "Explicit Content," etc.
- **Progress Tracking**: Displays the upload progress using a progress bar.
- **Detailed Results**: Shows moderation results in tabular format, customized for images and videos.
- **Error Handling**: Alerts users of any issues during upload or scanning.

---

## Technologies Used

### Frontend:
- **React.js**: For building the user interface.
- **React-Bootstrap**: For styling and responsive design.
- **Axios**: For making HTTP requests to the backend.

### Backend:
- **Node.js**: To handle server-side processing.
- **Express.js**: For building REST APIs.
- **AWS Rekognition**: For content moderation using machine learning.

---

## Installation and Setup

### Prerequisites:
- **Node.js** (v14+)
- **npm** or **yarn**
- Backend server configured with an API endpoint for moderation.

### Clone the Repository:
```bash
git clone https://github.com/your-username/content-moderation.git
cd content-moderation
```

### Frontend Setup:
1. Navigate to the frontend directory:
   ```bash
   cd front-end
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

4. The app will run on `http://localhost:3000`.

### Backend Setup:
1. Navigate to the backend directory:
   ```bash
   cd back-end
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure AWS credentials for Rekognition API in the `.env` file:
   ```plaintext
   AWS_ACCESS_KEY_ID=your-access-key-id
   AWS_SECRET_ACCESS_KEY=your-secret-access-key
   AWS_REGION=your-region
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

5. The backend will run on `http://localhost:5001`.

---

## Usage

1. Open the frontend application in your browser: `http://localhost:3000`.
2. Choose a file (image or video) to upload.
3. Click **Preview** to view the selected file.
4. Click **Scan** to send the file for moderation.
5. View the results in the **Moderation Results** table.

---

## File Formats Supported

### Images:
- `.jpeg`
- `.jpg`
- `.png`
- `.gif`

### Videos:
- `.mp4`
- `.avi`
- `.mkv`
- `.webm`

---

## Project Structure

```
content-moderation/
├── front-end/           # React frontend
│   ├── src/
│   │   ├── components/  # Modular React components
│   │   ├── App.js
│   │   ├── Home.js
│   │   └── index.js
│   └── package.json
├── back-end/            # Node.js backend
│   ├── index.js         # Main server file
│   ├── routes/          # API routes
│   ├── services/        # AWS Rekognition integration
│   ├── .env             # AWS credentials
│   └── package.json
└── README.md            # Project documentation
```

---


## Future Enhancements

1. **User Authentication**: Add login and roles for restricted content.
2. **File History**: Store previously scanned files with results.
3. **Multi-Language Support**: Add support for different languages.
4. **Improved Styling**: Enhance UI/UX for a more polished look.

---



## Contact

If you have any questions, feel free to reach out:

- **Author**: Srikanth Pusthem
- **Email**: pusthesh@mail.uc.edu
- **GitHub**: [srikanthpusthem](https://github.com/srikanthpusthem) 

---

