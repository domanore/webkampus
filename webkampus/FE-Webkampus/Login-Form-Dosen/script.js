document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#loginForm')

    form.addEventListener('submit', async (e) => {
        e.preventDefault()

        // Ambil data input
        const nidn = document.querySelector('#nidn').value
        const password = document.querySelector('#password').value

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nidn,
                    password
                })
            })

            const result = await response.json()

            if (result.success) {
                // Simpan data user di session storage
                sessionStorage.setItem('userData', JSON.stringify(result.user))
                
                // Redirect ke halaman utama
                window.location.href = '../Tampilan-Awal/index.html'
            } else {
                alert(result.message)
            }
        } catch (error) {
            console.error('Error:', error)
            alert('Gagal login')
        }
    })
})