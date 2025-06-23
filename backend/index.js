const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

// Configuración de Multer para subir imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Utilidades para leer y escribir JSON
function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return [];
  }
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Rutas para traducciones
app.get('/api/translations', (req, res) => {
  const data = readJSON('translations.json');
  res.json(data);
});
app.post('/api/translations', (req, res) => {
  const data = readJSON('translations.json');
  data.push(req.body);
  writeJSON('translations.json', data);
  res.json({ ok: true });
});

// Rutas para trucos
app.get('/api/tricks', (req, res) => {
  const data = readJSON('tricks.json');
  res.json(data);
});
app.post('/api/tricks', (req, res) => {
  const data = readJSON('tricks.json');
  data.push(req.body);
  writeJSON('tricks.json', data);
  res.json({ ok: true });
});

// Rutas para galería
app.get('/api/gallery', (req, res) => {
  const data = readJSON('gallery.json');
  res.json(data);
});
app.post('/api/gallery', upload.single('image'), (req, res) => {
  const data = readJSON('gallery.json');
  const newEntry = {
    image: req.file ? '/images/' + req.file.filename : '',
    text: req.body.text || ''
  };
  data.push(newEntry);
  writeJSON('gallery.json', data);
  res.json({ ok: true });
});

// Rutas para la página de inicio
app.get('/api/home', (req, res) => {
  let data = {};
  try {
    data = JSON.parse(fs.readFileSync('home.json', 'utf8'));
  } catch {
    data = { title: '', text: '' };
  }
  res.json(data);
});
app.post('/api/home', (req, res) => {
  fs.writeFileSync('home.json', JSON.stringify(req.body, null, 2));
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`);
}); 