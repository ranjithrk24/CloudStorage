const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', cors(), express.static(path.join(__dirname, 'uploads')));

const users = [
  { username: 'test', password: 'test' },
  { username: 'ranjith', password: 'ranjith' },
  { username: 'alice', password: 'alice123' },
  { username: 'bob', password: 'bob456' }
];

const IMAGES_JSON = path.join(__dirname, 'images.json');
let images = [];
if (fs.existsSync(IMAGES_JSON)) {
  images = JSON.parse(fs.readFileSync(IMAGES_JSON, 'utf-8'));
}

const texts = [];  // { message, user }

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ user: username });
});

app.get('/download/:user/:filename', (req, res) => {
    const { user, filename } = req.params;
    const filePath = path.join(__dirname, 'uploads', user, filename);
    if (fs.existsSync(filePath)) {
      res.download(filePath, filename); // This sets Content-Disposition: attachment
    } else {
      res.status(404).send('File not found');
    }
  });

// Multer storage config
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadPath = path.join(__dirname, 'uploads');
//     if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });
// const upload = multer({ storage });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Try to get user from body, query, or headers as fallback
      console.log('req.body:', req.body);
      const user = req.body.user || req.query.user || req.headers['x-user'];
      if (!user) return cb(new Error('User not specified'), null);
      const uploadPath = path.join(__dirname, 'uploads', user);
      if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  const upload = multer({ storage });

// Save text with user
app.post('/api/save-text', (req, res) => {
  const { message, user } = req.body;
  if (!user || !message) return res.status(400).json({ error: 'Missing user or message' });
  texts.push({ message, user });
  res.json({ success: true });
});

// Get texts for a user
app.get('/api/texts', (req, res) => {
  const user = req.query.user;
  const userTexts = texts.filter(t => t.user === user);
  res.json(userTexts);
});

// Upload image with user and persist metadata
// app.post('/api/upload-image', upload.single('image'), (req, res) => {
//   const user = req.body.user;
//   const file = req.file;
//   if (!user || !file) return res.status(400).json({ error: 'Missing user or file' });
//   images.push({ name: file.filename, url: `/uploads/${file.filename}`, user });
//   fs.writeFileSync(IMAGES_JSON, JSON.stringify(images, null, 2));
//   res.json({ message: `Image uploaded: ${file.originalname}`, filePath: `/uploads/${file.filename}` });
// });

app.post('/api/upload-image', upload.single('image'), (req, res) => {
    const user = req.body.user;
    const file = req.file;
    if (!user || !file) return res.status(400).json({ error: 'Missing user or file' });
    images.push({ name: file.filename, url: `/uploads/${user}/${file.filename}`, user });
    fs.writeFileSync(IMAGES_JSON, JSON.stringify(images, null, 2));
    res.json({ message: `Image uploaded: ${file.originalname}`, filePath: `/uploads/${user}/${file.filename}` });
  });

// Get images for a user (only if file exists)
app.get('/api/images', (req, res) => {
  const user = req.query.user;
  const userImages = images
    .filter(img => img.user === user)
    .filter(img => fs.existsSync(path.join(__dirname, 'uploads',user, img.name)));
  res.json(userImages);
});

// Delete image and update metadata
app.delete('/api/images/:user/:filename', (req, res) => {
  const {user,filename} = req.params;
  const filePath = path.join(__dirname, 'uploads',user, filename);

  // Remove from images array
  const index = images.findIndex(img => img.name === filename && img.user === user);
  if (index !== -1) {
    images.splice(index, 1);
    fs.writeFileSync(IMAGES_JSON, JSON.stringify(images, null, 2));
  }

  // Remove file from disk
  fs.unlink(filePath, (err) => {
    if (err && err.code !== 'ENOENT') {
      return res.status(500).json({ error: 'Failed to delete file' });
    }
    res.json({ success: true });
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));