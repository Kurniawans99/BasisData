// Ambil elemen tabel dan form
const tableBody = document.querySelector("#karyawanTable tbody");
const addKaryawanForm = document.querySelector("#addKaryawanForm");

// Fetch data karyawan dari API
function loadKaryawan() {
  fetch("http://localhost:8000/api/data/karyawan")
    .then((response) => response.json())
    .then((data) => {
      tableBody.innerHTML = ""; // Bersihkan tabel sebelum menampilkan data baru
      data.forEach((karyawan) => {
        const row = document.createElement("tr");
        console.log(karyawan);
        row.innerHTML = `
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">${karyawan.nama}</td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">${karyawan.posisi}</td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">${karyawan.nomor_telepon}</td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">${karyawan.shift}</td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">${karyawan.alamat}</td>
                <td class="px-5 py-3 border-b text-sm text-gray-900">
                        <button class="text-blue-500" onclick="editKaryawan(${karyawan.id_karyawan})">Edit</button>
                        <button class="text-red-500 ml-2" onclick="hapusKaryawan(${karyawan.id_karyawan})">Hapus</button>
                    </td>
          `;
        tableBody.appendChild(row);
      });
    })
    .catch((err) => {
      console.error("Error fetching data:", err);
    });
}

// Tambah karyawan baru
addKaryawanForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Mencegah form submit default

  const newKaryawan = {
    nama: document.querySelector("#nama").value,
    posisi: document.querySelector("#posisi").value,
    nomor_telepon: document.querySelector("#nomor_telepon").value,
    shift: document.querySelector("#shift").value,
    alamat: document.querySelector("#alamat").value,
    id_restoran: document.querySelector("#id_restoran").value, // Menambahkan id_restoran
  };

  // Kirim data ke backend
  fetch("http://localhost:8000/api/tambah/karyawan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newKaryawan),
  })
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(text); // Jika bukan JSON, lempar error
        });
      }
      return response.json();
    })
    .then((data) => {
      loadKaryawan();
      alert(data.message || "Karyawan berhasil ditambahkan");
    })
    .catch((err) => {
      console.error("Error adding data:", err.message);
      alert("Gagal menambahkan karyawan: " + err.message);
    });
});
function editKaryawan(id) {
  fetch(`http://localhost:8000/api/karyawan/${id}`) // Ambil data karyawan berdasarkan ID
    .then((response) => response.json())
    .then((karyawan) => {
      // Isi form dengan data karyawan
      document.getElementById("nama").value = karyawan.nama;
      document.getElementById("posisi").value = karyawan.posisi;
      document.getElementById("nomor_telepon").value = karyawan.nomor_telepon;
      document.getElementById("shift").value = karyawan.shift;
      document.getElementById("alamat").value = karyawan.alamat;
      document.getElementById("id_restoran").value = karyawan.id_restoran;

      // Menambahkan ID karyawan ke form untuk pengeditan
      document
        .getElementById("addKaryawanForm")
        .setAttribute("data-id", karyawan.id);
    })
    .catch((error) => console.error("Error loading data for edit:", error));
}

// Mengubah form untuk mengupdate karyawan
document
  .getElementById("addKaryawanForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const id = e.target.getAttribute("data-id");
    const newKaryawan = {
      nama: document.querySelector("#nama").value,
      posisi: document.querySelector("#posisi").value,
      nomor_telepon: document.querySelector("#nomor_telepon").value,
      shift: document.querySelector("#shift").value,
      alamat: document.querySelector("#alamat").value,
      id_restoran: document.querySelector("#id_restoran").value,
    };

    // Jika ID ada, lakukan PUT untuk memperbarui
    if (id) {
      fetch(`http://localhost:8000/api/data/karyawan/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newKaryawan),
      })
        .then((response) => response.json())
        .then((data) => {
          loadKaryawanData(); // Muat ulang data karyawan
          alert("Data karyawan berhasil diperbarui");
        })
        .catch((error) => console.error("Error updating data:", error));
    } else {
      // Jika tidak ada ID, lakukan POST untuk menambah
      fetch("http://localhost:8000/api/tambah/karyawan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newKaryawan),
      })
        .then((response) => response.json())
        .then((data) => {
          loadKaryawan(); // Muat ulang data karyawan
          alert("Karyawan berhasil ditambahkan");
        })
        .catch((error) => console.error("Error adding data:", error));
    }
  });

function hapusKaryawan(id) {
  console.log(id);
  if (confirm("Apakah Anda yakin ingin menghapus karyawan ini?")) {
    fetch(`http://localhost:8000/api/hapus/karyawan/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        loadKaryawan(); // Muat ulang data karyawan
        alert("Karyawan berhasil dihapus");
      })
      .catch((error) => console.error("Error deleting data:", error));
  }
}
// Muat data karyawan saat halaman dimuat
loadKaryawan();
