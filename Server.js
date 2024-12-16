const express = require("express");
const mysql = require("mysql");
const cors = require("cors"); // Import cors
const app = express();
const port = 8000;

app.use(express.json()); // Middleware untuk parsing JSON body
app.use(express.urlencoded({ extended: true })); // Middleware untuk parsing urlencoded body
// Aktifkan CORS
app.use(cors()); // Ini mengizinkan semua permintaan CORS

// Set EJS sebagai template engine
app.set("view engine", "ejs");
app.use(express.static("public"));

// Menyiapkan koneksi ke MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "restoran",
});

// Menyambungkan ke database
connection.connect((err) => {
  if (err) {
    console.error("Kesalahan koneksi: " + err.stack);
    return;
  }
  console.log(
    "Terhubung ke database dengan ID koneksi: " + connection.threadId
  );
});

// Menyiapkan route untuk mendapatkan data dari MySQL

app.get("/api/data/karyawan", (req, res) => {
  connection.query("SELECT * FROM karyawan", (err, results) => {
    if (err) {
      res.status(500).send("Terjadi kesalahan pada server");
      return;
    }
    res.json(results); // Mengirim data sebagai JSON
  });
});

// Menyiapkan route untuk menambahkan data ke MySQL
app.post("/api/tambah/karyawan", (req, res) => {
  const { nama, posisi, nomor_telepon, shift, alamat, id_restoran } = req.body;

  console.log("Menerima data:", req.body); // Debug log untuk memastikan data yang dikirim
  // Validasi nilai ENUM untuk shift
  const validShifts = ["Pagi", "Siang", "Malam"];
  if (!validShifts.includes(shift)) {
    return res
      .status(400)
      .send("Shift harus salah satu dari: Pagi, Siang, Malam");
  }

  const query = `
    INSERT INTO karyawan (nama, posisi, nomor_telepon, shift, alamat, id_restoran) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    query,
    [nama, posisi, nomor_telepon, shift, alamat, id_restoran], // Sertakan id_restoran dalam query
    (err) => {
      if (err) {
        console.error("Error inserting data:", err); // Menampilkan kesalahan di konsol server
        return res.status(500).send("Failed to add karyawan");
      }
      res.status(201).send("Karyawan added");
    }
  );
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
