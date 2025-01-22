document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#registerForm')

    form.addEventListener('submit', async (e) => {
        e.preventDefault()

        // Ambil data dari form
        const userData = {
            name: document.querySelector('#name').value,
            email: document.querySelector('#email').value,
            nidn: document.querySelector('#nidn').value,
            password: document.querySelector('#password').value,
            confirmPassword: document.querySelector('#confirmPassword').value,
            // Optional: tambahkan field tambahan
            fakultas: document.querySelector('#fakultas')?.value || null,
            prodi: document.querySelector('#prodi')?.value || null,
            telepon: document.querySelector('#telepon')?.value || null
        }

        try {
            const response = await fetch('http://localhost:3000/register/dosen', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })

            const result = await response.json()

            if (result.success) {
                alert('Registrasi berhasil')
                // Redirect ke halaman login dosen
                window.location.href = '../Login-Form-Dosen/index.html'
            } else {
                alert(result.message)
            }
        } catch (error) {
            console.error('Error:', error)
            alert('Gagal registrasi')
        }
    })
})