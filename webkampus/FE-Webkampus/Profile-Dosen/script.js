document.addEventListener('DOMContentLoaded', () => {
    // Ambil data pengguna dari session storage
    const userData = JSON.parse(sessionStorage.getItem('userData'))

    // Fungsi untuk memperbarui informasi profil di halaman
    function updateProfileInfo() {
        // Debug: Cek data user
        console.log('Updating Profile Info:', userData)

        // Update header profil
        document.getElementById('userName').textContent = userData.name || 'Nama Pengguna'
        document.getElementById('userRole').textContent = userData.role || 'Role Pengguna'

        // Update informasi tambahan
        document.getElementById('userEmail').textContent = userData.email || '-'
        document.getElementById('userIdentity').textContent = userData.nim || userData.nidn || '-'
        document.getElementById('userTelepon').textContent = userData.telepon || '-'
        document.getElementById('userFakultas').textContent = userData.fakultas || '-'
        document.getElementById('userProdi').textContent = userData.prodi || '-'

        // Update foto profil jika tersedia
        const profileImage = document.getElementById('profileImage')
        profileImage.src = userData.profilePhoto 
            ? `http://localhost:3000${userData.profilePhoto}` 
            : 'https://i.pinimg.com/736x/ca/53/34/ca5334034a44fb084e4cddb441e806e2.jpg'
    }

    // Fungsi untuk memuat data profil di form edit
    function loadProfileDataToForm() {
        // Debug: Cek data user saat load form
        console.log('Loading Profile Data:', userData)

        document.getElementById('editName').value = userData.name || ''
        document.getElementById('editEmail').value = userData.email || ''
        document.getElementById('editTelepon').value = userData.telepon || ''
        document.getElementById('editFakultas').value = userData.fakultas || ''
        document.getElementById('editProdi').value = userData.prodi || ''
    }

    // Validasi form
    function validateProfileForm() {
        const name = document.getElementById('editName').value.trim()
        const email = document.getElementById('editEmail').value.trim()
        const password = document.getElementById('editPassword').value
        const confirmPassword = document.getElementById('editConfirmPassword').value

        // Validasi nama
        if (name.length < 3) {
            alert('Nama minimal 3 karakter')
            return false
        }

        // Validasi email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            alert('Format email tidak valid')
            return false
        }

        // Validasi password jika diisi
        if (password) {
            if (password.length < 6) {
                alert('Password minimal 6 karakter')
                return false
            }
            if (password !== confirmPassword) {
                alert('Password dan Konfirmasi Password tidak cocok')
                return false
            }
        }

        return true
    }

    // Fungsi upload foto profil
    async function uploadProfilePhoto(file) {
        const formData = new FormData()
        formData.append('profilePhoto', file)

        try {
            const response = await fetch(`http://localhost:3000/upload-profile-photo/${userData.id}`, {
                method: 'POST',
                body: formData
            })

            const result = await response.json()

            if (result.success) {
                // Update foto di session storage
                userData.profilePhoto = result.photoUrl
                sessionStorage.setItem('userData', JSON.stringify(userData))
                
                // Update foto di halaman
                document.getElementById('profileImage').src = `http://localhost:3000${result.photoUrl}`
                
                alert('Foto profil berhasil diperbarui')
            } else {
                alert(result.message || 'Gagal mengunggah foto')
            }
        } catch (error) {
            console.error('Error upload foto:', error)
            alert('Gagal mengunggah foto')
        }
    }

    // Fungsi update profil
    async function updateProfile(e) {
        e.preventDefault()

        if (!validateProfileForm()) return

        try {
            // Siapkan data update
            const updatedData = {
                name: document.getElementById('editName').value,
                email: document.getElementById('editEmail').value,
                telepon: document.getElementById('editTelepon').value,
                fakultas: document.getElementById('editFakultas').value,
                prodi: document.getElementById('editProdi').value
            }

            // Tambahkan password jika diisi
            const password = document.getElementById('editPassword').value
            if (password) {
                updatedData.password = password
            }

            // Debug: Tampilkan data yang akan dikirim
            console.log('Updating Profile Data:', updatedData)

            // Kirim request update
            const response = await fetch(`http://localhost:3000/edit-profile/${userData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            })

            const result = await response.json()

            // Debug: Tampilkan response dari server
            console.log('Update Profile Response:', result)

            if (result.success) {
                // Update data di session storage
                Object.keys(updatedData).forEach(key => {
                    userData[key] = updatedData[key]
                })
                
                // Simpan data terbaru
                sessionStorage.setItem('userData', JSON.stringify(userData))

                // Update tampilan langsung
                document.getElementById('userName').textContent = userData.name
                document.getElementById('userEmail').textContent = userData.email
                document.getElementById('userTelepon').textContent = userData.telepon || '-'
                document.getElementById('userFakultas').textContent = userData.fakultas || '-'
                document.getElementById('userProdi').textContent = userData.prodi || '-'

                alert('Profil berhasil diperbarui')
                
                // Tutup modal
                const modalElement = document.getElementById('editProfileModal')
                const modal = bootstrap.Modal.getInstance(modalElement)
                modal.hide()

                // Reset form
                document.getElementById('editPassword').value = ''
                document.getElementById('editConfirmPassword').value = ''
            } else {
                alert(result.message || 'Gagal memperbarui profil')
            }
        } catch (error) {
            console.error('Error update profil:', error)
            alert('Gagal memperbarui profil')
        }
    }

    // Event listener untuk upload foto
    document.getElementById('editProfileImage').addEventListener('change', (e) => {
        const file = e.target.files[0]
        if (file) {
            uploadProfilePhoto(file)
        }
    })

    // Event listener untuk simpan perubahan
    document.getElementById('saveProfileChanges').addEventListener('click', updateProfile)

    // Inisialisasi halaman
    if (userData) {
        updateProfileInfo()
        loadProfileDataToForm()
    } else {
        // Redirect ke halaman login jika tidak ada data user
        window.location.href = '../Login-Sebagai/index.html'
    }
})