const express = require("express");
const mysql = require("mysql");
const cors = require("cors"); // Import cors
const app = express();
const port = 8000;

app.use(express.json()); // Middleware untuk parsing JSON body
app.use(express.urlencoded({ extended: true })); // Middleware untuk parsing urlencoded body
app.use(cors()); // Aktifkan CORS agar semua request bisa diterima

// Set EJS sebagai template engine
app.set("view engine", "ejs");
app.use(express.static("public"));

// Menyiapkan koneksi ke MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "multi_restoran",
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

// Route: GET semua data karyawan atau filter berdasarkan id_restoran
app.get("/api/data/karyawan", (req, res) => {
  const { id_restoran } = req.query; // Ambil id_restoran dari query parameter

  let query = "SELECT * FROM karyawan";
  let params = [];

  if (id_restoran) {
    query += " WHERE id_restoran = ?";
    params.push(id_restoran);
  }

  connection.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res
        .status(500)
        .json({ message: "Terjadi kesalahan pada server", error: err.message });
    }
    res.status(200).json(results); // Kirim data hasil query
  });
});

// Route: POST tambah karyawan
app.post("/api/tambah/karyawan", (req, res) => {
  const { nama, posisi, nomor_telepon, shift, alamat, id_restoran } = req.body;

  console.log("Menerima data:", req.body); // Debug log untuk memastikan data

  // Validasi input
  if (!nama || !posisi || !nomor_telepon || !shift || !alamat || !id_restoran) {
    return res.status(400).json({ message: "Semua field harus diisi!" });
  }

  // Validasi shift
  const validShifts = ["Pagi", "Siang", "Malam"];
  if (!validShifts.includes(shift)) {
    return res
      .status(400)
      .json({ message: "Shift harus salah satu dari: Pagi, Siang, Malam" });
  }

  // Query untuk menambahkan data
  const query = `
    INSERT INTO karyawan (nama, posisi, nomor_telepon, shift, alamat, id_restoran) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    query,
    [nama, posisi, nomor_telepon, shift, alamat, id_restoran],
    (err, result) => {
      if (err) {
        console.error("Error inserting data:", err);
        return res
          .status(500)
          .json({ message: "Failed to add karyawan", error: err.message });
      }
      res.status(201).json({
        message: "Karyawan berhasil ditambahkan",
        id: result.insertId, // Kirim ID hasil penambahan
      });
    }
  );
});

// Update data karyawan berdasarkan ID
app.put("/api/edit/karyawan/:id", (req, res) => {
  const { id } = req.params; // Ambil id dari parameter
  const { nama, posisi, nomor_telepon, shift, alamat, id_restoran } = req.body;

  console.log("Menerima data untuk update:", req.body); // Debugging

  // Validasi nilai ENUM untuk shift
  const validShifts = ["Pagi", "Siang", "Malam"];
  if (!validShifts.includes(shift)) {
    return res
      .status(400)
      .json({ message: "Shift harus salah satu dari: Pagi, Siang, Malam" });
  }

  // Query untuk mengupdate data
  const query = `
    UPDATE karyawan 
    SET nama = ?, posisi = ?, nomor_telepon = ?, shift = ?, alamat = ?, id_restoran = ?
    WHERE id_karyawan = ?
  `;

  connection.query(
    query,
    [nama, posisi, nomor_telepon, shift, alamat, id_restoran, id],
    (err, result) => {
      if (err) {
        console.error("Error updating data:", err);
        return res
          .status(500)
          .json({ message: "Failed to update karyawan", error: err.message });
      }
      res.status(200).json({ message: "Karyawan updated successfully" });
    }
  );
});

// Route: DELETE hapus karyawan berdasarkan ID
app.delete("/api/hapus/karyawan/:id", (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM karyawan WHERE id_karyawan = ?`;
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting data:", err);
      return res
        .status(500)
        .json({ message: "Failed to delete karyawan", error: err.message });
    }

    if (result.affectedRows === 0) {
      // Jika ID tidak ditemukan
      return res
        .status(404)
        .json({ message: "Karyawan dengan ID tersebut tidak ditemukan" });
    }

    res.status(200).json({ message: "Karyawan berhasil dihapus" });
  });
});

// Route: GET semua data restoran
app.get("/api/data/restoran", (req, res) => {
  connection.query("SELECT * FROM restoran", (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res
        .status(500)
        .json({ message: "Terjadi kesalahan pada server", error: err.message });
    }
    res.status(200).json(results);
  });
});

// Route: POST tambah restoran
app.post("/api/tambah/restoran", (req, res) => {
  const {
    kota,
    alamat,
    nomor_telepon,
    tanggal_dibuka,
    kapasitas,
    id_perusahaan,
  } = req.body;

  if (
    !kota ||
    !alamat ||
    !nomor_telepon ||
    !tanggal_dibuka ||
    !kapasitas ||
    !id_perusahaan
  ) {
    return res.status(400).json({ message: "Semua field harus diisi!" });
  }

  const query = `
    INSERT INTO restoran (kota, alamat, nomor_telepon, tanggal_dibuka, kapasitas, id_perusahaan)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    query,
    [kota, alamat, nomor_telepon, tanggal_dibuka, kapasitas, id_perusahaan],
    (err, result) => {
      if (err) {
        console.error("Error inserting data:", err);
        return res
          .status(500)
          .json({ message: "Failed to add restoran", error: err.message });
      }
      res.status(201).json({
        message: "Restoran berhasil ditambahkan",
        id: result.insertId,
      });
    }
  );
});

// Route: PUT edit restoran berdasarkan ID
app.put("/api/edit/restoran/:id", (req, res) => {
  const { id } = req.params;
  const {
    kota,
    alamat,
    nomor_telepon,
    tanggal_dibuka,
    kapasitas,
    id_perusahaan,
  } = req.body;

  const query = `
    UPDATE restoran 
    SET kota = ?, alamat = ?, nomor_telepon = ?, tanggal_dibuka = ?, kapasitas = ?, id_perusahaan = ?
    WHERE id_restoran = ?
  `;

  connection.query(
    query,
    [kota, alamat, nomor_telepon, tanggal_dibuka, kapasitas, id_perusahaan, id],
    (err, result) => {
      if (err) {
        console.error("Error updating data:", err);
        return res
          .status(500)
          .json({ message: "Failed to update restoran", error: err.message });
      }
      res.status(200).json({ message: "Restoran berhasil diperbarui" });
    }
  );
});

// Route: DELETE hapus restoran berdasarkan ID
app.delete("/api/hapus/restoran/:id", (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM restoran WHERE id_restoran = ?`;
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting data:", err);
      return res
        .status(500)
        .json({ message: "Failed to delete restoran", error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Restoran tidak ditemukan" });
    }

    res.status(200).json({ message: "Restoran berhasil dihapus" });
  });
});

// Cek ID Restoran
app.get("/api/cek/restoran/:id", (req, res) => {
  const idRestoran = req.params.id;
  db.query(
    "SELECT * FROM restoran WHERE id_restoran = ?",
    [idRestoran],
    (err, results) => {
      if (err) throw err;
      res.json({ exists: results.length > 0 });
    }
  );
});

// Server berjalan pada port yang ditentukan
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
