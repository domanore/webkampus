document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#loginForm')

    form.addEventListener('submit', async (e) => {
        e.preventDefault()

        const userData = {
            nim: document.querySelector('#npm').value,
            password: document.querySelector('#password').value
        }

        try {
            const response = await fetch ('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })

            const user = await response.json()
            if(!user.success) {
                alert (user.message)
                return
            }

            alert('Berhasil Login')
            sessionStorage.setItem('userData', JSON.stringify(user))
            window.location.href = '/webkampus/FE-Webkampus/Tampilan-Awal/index.html'
        } catch (e) {
            console.log(e.message)
        }
    })
})