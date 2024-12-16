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
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">${karyawan.id}</td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">${karyawan.nama}</td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">${karyawan.posisi}</td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">${karyawan.nomor_telepon}</td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">${karyawan.shift}</td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">${karyawan.alamat}</td>
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
      if (response.ok) {
        alert("Karyawan berhasil ditambahkan!");
        addKaryawanForm.reset(); // Reset form
        loadKaryawan();
      } else {
        console.error("Failed to add karyawan");
      }
    })
    .catch((err) => {
      console.error("Error adding karyawan:", err);
    });
});
// Muat data karyawan saat halaman dimuat
loadKaryawan();
