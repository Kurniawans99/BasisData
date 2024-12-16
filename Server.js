const express = require('express');
const mysql = require('mysql');
const cors = require('cors'); // Import cors
const app = express();
const port = 8000;

// Aktifkan CORS
app.use(cors()); // Ini mengizinkan semua permintaan CORS
// Menyiapkan koneksi ke MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'egi123',
  database: 'uji_coba'
});

// Menyambungkan ke database
connection.connect((err) => {
  if (err) {
    console.error('Kesalahan koneksi: ' + err.stack);
    return;
  }
  console.log('Terhubung ke database dengan ID koneksi: ' + connection.threadId);
});

// Menyiapkan route untuk mendapatkan data dari MySQL
app.get('/api/data', (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      res.status(500).send('Terjadi kesalahan pada server');
      return;
    }
    res.json(results); // Mengirim data sebagai JSON
  });
});

// Menyiapkan route untuk menambahkan data ke MySQL
app.get('/api/tambah', (req, res) => {
  const { nama, umur } = req.query; // Mengambil data dari query parameter
  connection.query(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    [nama, umur],
    (err, results) => {
      if (err) {
        res.status(500).send('Terjadi kesalahan pada server');
        return;
      }
      res.send('Data berhasil ditambahkan');
    }
  );
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
