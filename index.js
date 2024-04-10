const express = require('express');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer configuration
const upload = multer({ dest: path.join(__dirname, 'uploads/') });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// Define hotel schema
const hotelSchema = new mongoose.Schema({
  id: Number,
  name: String,
  location: String,
  pictureUrl: String, // URL of the hotel picture uploaded to Cloudinary
  roomPrice: String,
  rating: String,
  email: String,
  phone: String,
});

const trackSchema = new mongoose.Schema({
  id: Number,
  name: String,
  distance_km: String,
  duration_days: Number,
  starting_point: String,
  ending_point: String,
  image: String,
});

// Create hotel model
const Hotel = mongoose.model('Hotel', hotelSchema);

//create track model:
const Track = mongoose.model('Track', trackSchema);

// Endpoint for uploading hotel picture to Cloudinary
app.post('/hotels/picture', upload.single('picture'), async (req, res) => {
  try {
    // Upload the hotel picture to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, { folder: 'hotel-pictures' });
    res.json({ pictureUrl: result.secure_url });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// API endpoints
app.get('/hotels', async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/tracks', async (req, res) => {
  try {
    const tracks = await Track.find();
    res.json(tracks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/hotels', async (req, res) => {
  const hotel = new Hotel({
    id: req.body.id,
    name: req.body.name,
    location: req.body.location,
    pictureUrl: req.body.pictureUrl,
    roomPrice: req.body.roomPrice,
    rating: req.body.rating,
    email: req.body.email,
    phone: req.body.phone,

  });

  try {
    const newHotel = await hotel.save();
    res.status(201).json(newHotel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post('/tracks', async (req, res) => {
  const track = new Track({
    id: req.body.id,
    name: req.body.name,
    distance_km: req.body.distance_km,
    duration_days: req.body.duration_days,
    starting_point: req.body.starting_point,
    ending_point: req.body.ending_point,
    image: req.body.image

  });

  try {
    const newTrack = await track.save();
    res.status(201).json(newTrack);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
