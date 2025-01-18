document.addEventListener('DOMContentLoaded', () => {
    // Ambil data pengguna dari session storage
    const userData = JSON.parse(sessionStorage.getItem('userData'))

    // Fungsi untuk memuat data profil
    function loadProfileData() {
        if (!userData || !userData.user) {
            alert('Sesi login habis. Silakan login kembali.')
            window.location.href = '../Login-Sebagai/index.html'
            return
        }

        const user = userData.user

        // Update elemen profil
        document.getElementById('userName').textContent = user.name || 'Nama Pengguna'
        document.getElementById('userRole').textContent = user.role || 'Role'
        document.getElementById('userEmail').textContent = user.email || '-'
        document.getElementById('userIdentity').textContent = user.nim || user.nidn || '-'
        document.getElementById('userTelepon').textContent = user.telepon || '-'
        document.getElementById('userFakultas').textContent = user.fakultas || '-'
        document.getElementById('userProdi').textContent = user.prodi || '-'

        // Populate edit form
        document.getElementById('editName').value = user.name || ''
        document.getElementById('editEmail').value = user.email || ''
        document.getElementById('editTelepon').value = user.telepon || ''
        document.getElementById('editFakultas').value = user.fakultas || ''
        document.getElementById('editProdi').value = user.prodi || ''
    }

    // Fungsi untuk menangani perubahan profil
    async function handleProfileUpdate(e) {
        e.preventDefault()

        // Ambil nilai dari form
        const updateData = {
            name: document.getElementById('editName').value,
            email: document.getElementById('editEmail').value,
            telepon: document.getElementById('editTelepon').value,
            fakultas: document.getElementById('editFakultas').value,
            prodi: document.getElementById('editProdi').value,
            password: document.getElementById('editPassword').value || null,
            confirmPassword: document.getElementById('editConfirmPassword').value || null
        }

        // Validasi password
        if (updateData.password !== updateData.confirmPassword) {
            alert('Konfirmasi password tidak cocok')
            return
        }

        try {
            const response = await fetch(`http://localhost:3000/edit-profile/${userData.user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            })

            const result = await response.json()

            if (response.ok) {
                // Update session storage
                sessionStorage.setItem('userData', JSON.stringify({
                    ...userData,
                    user: result.user
                }))

                // Reload profil
                loadProfileData()

                // Tutup modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'))
                modal.hide()

                alert('Profil berhasil diperbarui')
            } else {
                throw new Error(result.error || 'Gagal memperbarui profil')
            }
        } catch (error) {
            console.error('Error updating profile:', error)
            alert(error.message)
        }
    }

    // Fungsi untuk menangani unggah foto profil
    function handleProfileImageUpload(e) {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                document.getElementById('profileImage').src = event.target.result
            }
            reader.readAsDataURL(file)
        }
    }

    // Event listener
    const saveProfileButton = document.getElementById('saveProfileChanges')
    if (saveProfileButton) {
        saveProfileButton.addEventListener('click', handleProfileUpdate)
    }

    const profileImageInput = document.getElementById('editProfileImage')
    if (profileImageInput) {
        profileImageInput.addEventListener('change', handleProfileImageUpload)
    }

    // Inisialisasi data profil
    loadProfileData()

    // Logout handler
    function handleLogout() {
        sessionStorage.removeItem('userData')
        window.location.href = '../Login-Sebagai/index.html'
    }

    // User dropdown
    function userDropdown() {
        const userdropdown = document.getElementById("userdropdownMenu")
        userdropdown.style.display = userdropdown.style.display === "none" ? "block" : "none"
    }

    // Tambahkan event listener untuk dropdown
    const userDropdownTrigger = document.querySelector('.user a')
    if (userDropdownTrigger) {
        userDropdownTrigger.addEventListener('click', userDropdown)
    }

    // Close dropdown jika klik di luar
    window.addEventListener('click', (e) => {
        const userdropdown = document.getElementById("userdropdownMenu")
        const userDiv = document.querySelector(".user")

        if (userdropdown && userDiv && !userDiv.contains(e.target)) {
            userdropdown.style.display = "none"
        }
    })
})