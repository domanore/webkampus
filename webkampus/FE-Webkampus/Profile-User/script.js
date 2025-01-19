document.addEventListener('DOMContentLoaded', () => {
    // Ambil data pengguna dari session storage
    const userData = JSON.parse(sessionStorage.getItem('userData'))

    // Fungsi untuk memuat data profil
    function loadProfileData() {
        // Update foto profil
        const profileImage = document.getElementById('profileImage')
        profileImage.src = userData.profilePhoto 
            ? `http://localhost:3000${userData.profilePhoto}` 
            : 'https://i.pinimg.com/736x/ca/53/34/ca5334034a44fb084e4cddb441e806e2.jpg'

        // Update elemen profil
        document.getElementById('userName').textContent = userData.name || 'Nama Pengguna'
        document.getElementById('userRole').textContent = userData.role || 'Role'
        document.getElementById('userEmail').textContent = userData.email || '-'
        document.getElementById('userIdentity').textContent = userData.nidn || userData.nim || '-'
        document.getElementById('userTelepon').textContent = userData.telepon || '-'
        document.getElementById('userFakultas').textContent = userData.fakultas || '-'
        document.getElementById('userProdi').textContent = userData.prodi || '-'
    }

    // Fungsi untuk mengunggah foto profil
    async function handleProfileImageUpload(e) {
        const file = e.target.files[0]
        if (file) {
            // Buat FormData untuk upload
            const formData = new FormData()
            formData.append('profilePhoto', file)

            try {
                // Kirim foto ke server
                const response = await fetch(`http://localhost:3000/upload-profile-photo/${userData.id}`, {
                    method: 'POST',
                    body: formData
                })

                const result = await response.json()
                console.log('Upload Photo Result:', result)

                if (result.success) {
                    // Update foto di frontend
                    document.getElementById('profileImage').src = `http://localhost:3000${result.photoUrl}`
                    
                    // Update session storage
                    const updatedUserData = {...userData}
                    updatedUserData.profilePhoto = result.photoUrl
                    sessionStorage.setItem('userData', JSON.stringify(updatedUserData))

                    alert('Foto profil berhasil diperbarui')
                } else {
                    throw new Error(result.message)
                }
            } catch (error) {
                console.error('Error uploading photo:', error)
                alert('Gagal mengunggah foto: ' + error.message)
            }
        }
    }

    // Panggil fungsi untuk memuat data profil saat halaman dimuat
    loadProfileData()

    // Tambahkan event listener untuk input foto profil
    const profileImageInput = document.querySelector('#editProfileImage')
    profileImageInput.addEventListener('change', handleProfileImageUpload)
})