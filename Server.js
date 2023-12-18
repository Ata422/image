// server.js

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

// MongoDB connection URI. Replace 'your-db-uri' with your actual MongoDB connection URI.
const mongoURI = 'mongodb+srv://image:Image2345@cluster0.ldq9ebo.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Set up Multer to handle file uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Connect to MongoDB before starting the server
client.connect()
  .then(() => {
    console.log('Connected to MongoDB');

    // Handle image upload on the '/upload' route
    app.post('/upload', upload.single('image'), async (req, res) => {
        const { filename } = req.file;
      
        try {
          // Perform any database operations here, e.g., storing the filename in a MongoDB collection
          const database = client.db('your-database-name');
          const collection = database.collection('your-collection-name');
          await collection.insertOne({ filename }); // Adjust this as needed
      
          // Respond with a success message or other relevant data
          res.json({ success: true, filename });
        } catch (error) {
          console.error('Error handling upload or database operation', error);
          res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
      });
      

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
  });

// Close MongoDB connection on process exit
process.on('exit', () => {
  if (client.isConnected()) {
    client.close();
    console.log('Disconnected from MongoDB');
  }
});
