document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#registerForm')

    form.addEventListener('submit', async (e) => {
        e.preventDefault()

        // Validasi password
        const password = document.querySelector('#password').value
        const confirmPassword = document.querySelector('#confirmPassword').value

        if (password !== confirmPassword) {
            alert('Password tidak cocok')
            return
        }

        const userData = {
            name: document.querySelector('#name').value,
            email: document.querySelector('#email').value,
            nidn: document.querySelector('#nidn').value,
            password: password,
            confirmPassword: confirmPassword,
            rememberMe: document.querySelector('#rememberMe').checked
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
                alert('Berhasil Register')
                
                // Simpan data user di session storage jika "Ingat Saya" dicentang
                if (userData.rememberMe) {
                    sessionStorage.setItem('userData', JSON.stringify(result.user))
                }

                // Redirect ke halaman login
                window.location.href = '/webkampus/FE-Webkampus/Login-Form-Dosen/index.html'
            } else {
                alert(result.message)
            }
        } catch (error) {
            console.error('Registrasi error:', error)
            alert('Terjadi kesalahan saat registrasi')
        }
    })
})