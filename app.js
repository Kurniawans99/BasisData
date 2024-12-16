// Ambil data dari backend
fetch('http://localhost:3000/users')
    .then(response => response.json())
    .then(data => {
        const userList = document.getElementById('user-list');
        data.forEach(user => {
            const listItem = document.createElement('li');
            listItem.textContent = `${user.id}: ${user.name} (${user.email})`;
            userList.appendChild(listItem);
        });
    })
    .catch(error => console.error('Error:', error));

// Tambah user baru
document.getElementById('add-user-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            location.reload(); // Refresh halaman
        })
        .catch(error => console.error('Error:', error));
});
