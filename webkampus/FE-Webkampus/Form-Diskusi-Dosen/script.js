document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('diskusiForm')
    const userData = JSON.parse(sessionStorage.getItem('userData'))

    // Debug: Cek data user di awal
    console.log('Stored User Data:', userData)

    form.addEventListener('submit', async (e) => {
        e.preventDefault()

        // Ekstrak user ID dengan lebih robust
        let userId = null
        if (userData) {
            userId = userData.id || 
                     (userData.user && userData.user.id) || 
                     (userData.user && userData.user.userId)
        }

        // Debug: Cek user ID
        console.log('Extracted User ID:', userId)

        // Ambil data dari form
        const formData = {
            userId: userId,
            nama: document.getElementById('nama').value,
            npm: document.getElementById('npm').value,
            prodi: document.getElementById('prodi').value,
            waktu: document.getElementById('waktu').value,
            tempat: document.getElementById('tempat').value,
            alasanKonsultasi: document.getElementById('alasanKonsultasi').value,
            status: 'menunggu',
            dosenId: null // Sesuaikan dengan kebutuhan
        }

        // Debug: Log data yang akan dikirim
        console.log('Form Data to Send:', formData)

        try {
            const response = await fetch('http://localhost:3000/diskusi/tambah-diskusi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            // Debug: Cek response
            console.log('Response Status:', response.status)
            
            const result = await response.json()
            console.log('Server Response:', result)

            if (response.ok) {
                alert('Jadwal diskusi berhasil dibuat')
                window.location.href = '../Diskusi/index.html'
            } else {
                alert(result.message || 'Gagal membuat jadwal')
                console.error('Error Details:', result)
            }
        } catch (error) {
            console.error('Fetch Error:', error)
            alert('Gagal mengirim formulir: ' + error.message)
        }
    })
})