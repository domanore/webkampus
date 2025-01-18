document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#loginForm')

    form.addEventListener('submit', async (e) => {
        e.preventDefault()

        const userData = {
            identifier: document.querySelector('#npm').value,
            password: document.querySelector('#password').value,
            role: 'mahasiswa' // Tambahan role untuk identifikasi
        }

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })

            const result = await response.json()

            if (result.success) {
                // Simpan data user di session storage
                sessionStorage.setItem('userData', JSON.stringify(result.user))
                
                // Redirect ke halaman utama
                window.location.href = '/webkampus/FE-Webkampus/Tampilan-Awal/index.html'
            } else {
                // Tampilkan pesan error
                alert(result.message)
            }
        } catch (error) {
            console.error('Login error:', error)
            alert('Terjadi kesalahan saat login')
        }
    })
})