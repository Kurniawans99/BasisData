const restoranTableBody = document.querySelector("#restoranTable tbody");
const restoranForm = document.querySelector("#restoranForm");

// Load data restoran
function loadRestoran() {
  fetch("http://localhost:8000/api/data/restoran")
    .then((response) => response.json())
    .then((data) => {
      restoranTableBody.innerHTML = "";
      data.forEach((restoran) => {
        const date = new Date(restoran.tanggal_dibuka);
        const formattedDate = `${date.getDate()}-${
          date.getMonth() + 1
        }-${date.getFullYear()}`;

        const row = `
           <td class="px-5 py-5 border-b">${restoran.kota}</td>
                    <td class="px-5 py-5 border-b">${restoran.alamat}</td>
                    <td class="px-5 py-5 border-b">${restoran.nomor_telepon}</td>
                    <td class="px-5 py-5 border-b">${formattedDate}</td>
                    <td class="px-5 py-5 border-b">${restoran.kapasitas}</td>
                    <td class="px-5 py-5 border-b">
                        <button class="text-blue-500" onclick="editRestoran('${restoran.id_restoran}')">Edit</button>
                        <button class="text-red-500 ml-2" onclick="hapusRestoran('${restoran.id_restoran}')">Hapus</button>
                    </td>
        `;
        restoranTableBody.insertAdjacentHTML("beforeend", row);
      });
    });
}

// Tambah atau Update Restoran
restoranForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = restoranForm.dataset.id;

  const restoranData = {
    kota: document.querySelector("#kota").value,
    alamat: document.querySelector("#alamat").value,
    nomor_telepon: document.querySelector("#nomor_telepon").value,
    tanggal_dibuka: document.querySelector("#tanggal_dibuka").value,
    kapasitas: document.querySelector("#kapasitas").value,
    id_perusahaan: document.querySelector("#id_perusahaan").value,
  };

  const url = id
    ? `http://localhost:8000/api/edit/restoran/${id}`
    : "http://localhost:8000/api/tambah/restoran";
  const method = id ? "PUT" : "POST";

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(restoranData),
  }).then(() => {
    loadRestoran();
    restoranForm.reset();
    delete restoranForm.dataset.id;
  });
});

// Hapus restoran
function hapusRestoran(id) {
  if (confirm("Yakin ingin menghapus restoran ini?")) {
    fetch(`http://localhost:8000/api/hapus/restoran/${id}`, {
      method: "DELETE",
    }).then(() => loadRestoran());
  }
}

// Edit restoran
function editRestoran(id) {
  fetch(`http://localhost:8000/api/data/restoran`)
    .then((response) => response.json())
    .then((data) => {
      const restoran = data.find((item) => item.id_restoran == id);
      if (restoran) {
        const date = new Date(restoran.tanggal_dibuka);
        const formattedDate = date.toISOString().split("T")[0];

        document.querySelector("#kota").value = restoran.kota;
        document.querySelector("#alamat").value = restoran.alamat;
        document.querySelector("#nomor_telepon").value = restoran.nomor_telepon;
        document.querySelector("#tanggal_dibuka").value = formattedDate;
        document.querySelector("#kapasitas").value = restoran.kapasitas;
        document.querySelector("#id_perusahaan").value = restoran.id_perusahaan;

        restoranForm.dataset.id = id;
      }
    });
}

loadRestoran();
