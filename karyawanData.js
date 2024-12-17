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
addKaryawanForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const id = addKaryawanForm.getAttribute("data-id"); // Ambil ID jika ada

  const karyawanData = {
    nama: document.querySelector("#nama").value,
    posisi: document.querySelector("#posisi").value,
    nomor_telepon: document.querySelector("#nomor_telepon").value,
    shift: document.querySelector("#shift").value,
    alamat: document.querySelector("#alamat").value,
    id_restoran: document.querySelector("#id_restoran").value,
  };

  // PUT untuk update jika ada ID, POST untuk tambah jika tidak ada ID
  if (id) {
    fetch(`http://localhost:8000/api/edit/karyawan/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(karyawanData),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Data karyawan berhasil diperbarui");
        loadKaryawan(); // Muat ulang tabel data
        addKaryawanForm.removeAttribute("data-id"); // Reset ID di form
        addKaryawanForm.reset(); // Reset form
      })
      .catch((error) => console.error("Error updating karyawan:", error));
  } else {
    // Tambahkan data baru jika ID tidak ada
    fetch("http://localhost:8000/api/tambah/karyawan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(karyawanData),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Data karyawan berhasil ditambahkan");
        loadKaryawan(); // Muat ulang tabel data
        addKaryawanForm.reset();
      })
      .catch((error) => console.error("Error adding karyawan:", error));
  }
});
// Ambil data karyawan untuk diedit dan isi form
function editKaryawan(id) {
  fetch(`http://localhost:8000/api/data/karyawan`)
    .then((response) => response.json())
    .then((data) => {
      // Cari karyawan dengan ID yang sesuai
      const karyawan = data.find((item) => item.id_karyawan == id);
      if (!karyawan) return alert("Karyawan tidak ditemukan!");

      // Isi form dengan data karyawan
      document.querySelector("#nama").value = karyawan.nama;
      document.querySelector("#posisi").value = karyawan.posisi;
      document.querySelector("#nomor_telepon").value = karyawan.nomor_telepon;
      document.querySelector("#shift").value = karyawan.shift;
      document.querySelector("#alamat").value = karyawan.alamat;
      document.querySelector("#id_restoran").value = karyawan.id_restoran;

      // Tambahkan ID ke form untuk proses edit
      addKaryawanForm.setAttribute("data-id", karyawan.id_karyawan);
    })
    .catch((error) => console.error("Error loading data for edit:", error));
}

function hapusKaryawan(id) {
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
