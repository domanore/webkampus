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
            confirmPassword: document.querySelector('#confirmPassword').value
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
                // Redirect ke halaman login
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