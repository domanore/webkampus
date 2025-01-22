// Form-Diskusi/script.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('diskusiForm')
    const userData = JSON.parse(sessionStorage.getItem('userData'))

    // Fungsi ambil daftar dosen
    async function muatDaftarDosen() {
        try {
            const response = await fetch('http://localhost:3000/register/dosen')
            const result = await response.json()

            const dosenSelect = document.getElementById(' dosenSelect')
            result.dosen.forEach(dosen => {
                const option = document.createElement('option')
                option.value = dosen.id
                option.textContent = dosen.name
                dosenSelect.appendChild(option)
            })
        } catch (error) {
            console.error('Gagal memuat daftar dosen:', error)
        }
    }

    // Event listener untuk form submit
    form.addEventListener('submit', async (event) => {
        event.preventDefault()

        const formData = new FormData(form)
        const data = {
            mahasiswaId: userData.id,
            dosenId: formData.get('dosenId'),
            topikDiskusi: formData.get('topikDiskusi'),
            content: formData.get('content')
        }

        try {
            const response = await fetch('http://localhost:3000/diskusi/tambah', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            const result = await response.json()
            if (result.success) {
                alert('Diskusi berhasil dibuat!')
                form.reset()
            } else {
                alert(result.message)
            }
        } catch (error) {
            console.error('Gagal mengirim data diskusi:', error)
        }
    })

    muatDaftarDosen()
})