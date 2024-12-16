const express = require('express');
const mysql = require('mysql');
const path = require('path');
const app = express();
const port = 3000;

// Middleware untuk file statis
app.use(express.static(path.join(__dirname, '../TugasProjek')));

// Route default ke file `index.html`
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../TugasProjek/index.html'));
});

// Jalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});

// Koneksi ke database MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'egi123',
    database: 'uji_coba'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Endpoint untuk mendapatkan data
app.get('/users', (req, res) => {
    const query = 'SELECT * FROM users';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Error fetching data');
            return;
        }
        res.json(results);
    });
});

// Endpoint untuk menambahkan data
app.post('/users', (req, res) => {
    const { name, email } = req.body;

    // Cek apakah data name dan email ada
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }

    // Query untuk menambah data
    const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
    db.query(query, [name, email], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ message: 'Error inserting data' });
        }
        
        res.json({ message: 'User added successfully', id: result.insertId });
    });
});

// Jalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
