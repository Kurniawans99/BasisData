const perusahaanTableBody = document.querySelector("#perusahaanTable tbody");
const perusahaanForm = document.querySelector("#addPerusahaanForm");

// Load data perusahaan
function loadPerusahaan() {
  fetch("http://localhost:8000/api/data/perusahaan")
    .then((response) => response.json())
    .then((data) => {
      perusahaanTableBody.innerHTML = "";
      data.forEach((perusahaan) => {
        const row = `
          <tr>
            <td class="px-5 py-5 border-b">${perusahaan.nama}</td>
            <td class="px-5 py-5 border-b">${perusahaan.email}</td>
            <td class="px-5 py-5 border-b">${perusahaan.nomor_telepon}</td>
            <td class="px-5 py-5 border-b">${perusahaan.website}</td>
            <td class="px-5 py-5 border-b">${perusahaan.alamat}</td>
            <td class="px-5 py-5 border-b">${perusahaan.id_pemilik}</td>
            <td class="px-5 py-5 border-b">
              <button class="text-blue-500" onclick="editPerusahaan('${perusahaan.id_perusahaan}')">Edit</button>
              <button class="text-red-500 ml-2" onclick="hapusPerusahaan('${perusahaan.id_perusahaan}')">Hapus</button>
            </td>
          </tr>
        `;
        perusahaanTableBody.insertAdjacentHTML("beforeend", row);
      });
    })
    .catch((error) => console.error("Gagal memuat data perusahaan:", error));
}

// Tambah atau Update Perusahaan
perusahaanForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = perusahaanForm.dataset.id;

  const perusahaanData = {
    nama: document.querySelector("#nama").value,
    email: document.querySelector("#email").value,
    nomor_telepon: document.querySelector("#nomor_telepon").value,
    website: document.querySelector("#website").value,
    alamat: document.querySelector("#alamat").value,
    id_pemilik: document.querySelector("#id_pemilik").value,
  };

  const url = id
    ? `http://localhost:8000/api/edit/perusahaan/${id}`
    : "http://localhost:8000/api/tambah/perusahaan";
  const method = id ? "PUT" : "POST";

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(perusahaanData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Gagal menyimpan data perusahaan");
      }
      return response.json();
    })
    .then(() => {
      loadPerusahaan();
      perusahaanForm.reset();
      delete perusahaanForm.dataset.id;
    })
    .catch((error) => console.error("Error:", error));
});

// Hapus Perusahaan
function hapusPerusahaan(id) {
  if (confirm("Yakin ingin menghapus perusahaan ini?")) {
    fetch(`http://localhost:8000/api/hapus/perusahaan/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Gagal menghapus data perusahaan");
        }
        return response.json();
      })
      .then(() => loadPerusahaan())
      .catch((error) => console.error("Error:", error));
  }
}

// Edit Perusahaan
function editPerusahaan(id) {
  fetch("http://localhost:8000/api/data/perusahaan")
    .then((response) => response.json())
    .then((data) => {
      const perusahaan = data.find((item) => item.id_perusahaan == id);
      if (perusahaan) {
        document.querySelector("#nama").value = perusahaan.nama;
        document.querySelector("#email").value = perusahaan.email;
        document.querySelector("#nomor_telepon").value =
          perusahaan.nomor_telepon;
        document.querySelector("#website").value = perusahaan.website;
        document.querySelector("#alamat").value = perusahaan.alamat;
        document.querySelector("#id_pemilik").value = perusahaan.id_pemilik;

        perusahaanForm.dataset.id = id; // Simpan ID untuk edit
      }
    })
    .catch((error) => console.error("Gagal memuat data perusahaan:", error));
}

// Load data perusahaan saat halaman dimuat
loadPerusahaan();
