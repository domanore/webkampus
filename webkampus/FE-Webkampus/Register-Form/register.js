document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#registerForm')

    form.addEventListener('submit', async (e) => {
        e.preventDefault()

        const userData = {
            name: document.querySelector('#name').value,
            email: document.querySelector('#email').value,
            nim: document.querySelector('#nomorInduk').value,
            password: document.querySelector('#password').value,
            confirmPassword: document.querySelector('#confirmPassword').value,
        }

        try {
            const response = await fetch ('http://localhost:3000/register/mahasiswa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })

            const user = await response.json()
            if(!response.ok) {
                alert (user.error)
                return
            }

            alert('Berhasil Register')
            sessionStorage.setItem('userData', JSON.stringify(user))
            window.location.href = '/webkampus/FE-Webkampus/Login-Form-Mahasiswa/index.html'
        } catch (e) {
            console.log(e.message)
        } 
    })
})