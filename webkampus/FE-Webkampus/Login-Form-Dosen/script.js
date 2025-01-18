document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#loginForm')

    form.addEventListener('submit', async (e) => {
        e.preventDefault()

        const userData = {
            identifier: document.querySelector('#nidn').value,
            password: document.querySelector('#password').value,
            role: 'dosen'
        }

        try {
            console.log('Login Attempt:', userData);

            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })

            console.log('Response Status:', response.status);

            const result = await response.json()

            console.log('Login Result:', result);

            if (result.success) {
                sessionStorage.setItem('userData', JSON.stringify(result.user))
                window.location.href = '/webkampus/FE-Webkampus/Tampilan-Awal/index.html'
            } else {
                alert(result.message || 'Login gagal')
            }
        } catch (error) {
            console.error('Detailed Login Error:', {
                message: error.message,
                stack: error.stack
            });
            alert('Terjadi kesalahan: ' + error.message)
        }
    })
})