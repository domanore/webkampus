// Tambahkan script untuk menampilkan nama user
document.addEventListener('DOMContentLoaded', () => {
    // Ambil data user dari session storage
    const userData = JSON.parse(sessionStorage.getItem('userData'))

    if (userData) {
        // Update nama user di navbar
        const userNameElement = document.querySelector('.user p')
        const userPhotoElement = document.querySelector('.user img') // Tambahkan ini jika ada elemen foto

        if (userNameElement) {
            userNameElement.textContent = `Halo ${userData.name}!`
        }
        
        // Tambahkan foto profil jika tersedia
        if (userPhotoElement && userData.profilePhoto) {
            userPhotoElement.src = `http://localhost:3000${userData.profilePhoto}`
        }
    } else {
        // Jika tidak ada data user, kembalikan ke halaman login
        window.location.href = '../Login-Sebagai/index.html'
    }
})

// Fungsi dropdown user
function userDropdown() {
    const userdropdown = document.getElementById("userdropdownMenu");
    userdropdown.style.display = userdropdown.style.display === "none" ? "block" : "none";
}

// Optional: Close the dropdown if the user clicks outside of it
window.addEventListener("click", function (e) {
    const userdropdown = document.getElementById("userdropdownMenu");
    const userDiv = document.querySelector(".user");

    if (!userDiv.contains(e.target)) {
        userdropdown.style.display = "none";
    }
});