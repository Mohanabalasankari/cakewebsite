const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const productRoutes = require("./routes/products");
const productController = require('./controllers/productController');
const profileRoute = require('./routes/profile')
const authMiddleware = require('./middleware/authMiddleware');


dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Store files in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Set unique file names
  },
});

const upload = multer({ storage });
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse JSON bodies
app.use(express.static('uploads'));
app.use('/images', express.static('path_to_your_images_directory'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/products", productRoutes);
app.get('/api/products', productController.getProducts);
app.post('/api/products', upload.single('image'), productController.addProduct);
app.delete('/api/products/:id', productController.removeProduct);
app.use("/api", require("./routes/auth"));
app.get('/api/profile', profileRoute);








// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
