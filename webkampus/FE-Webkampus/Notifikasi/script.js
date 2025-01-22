document.addEventListener('DOMContentLoaded', () => {
    // Konfigurasi Awal
    const config = {
        apiBaseUrl: 'http://localhost:3000',
        pageSize: 10
    }

    // Elemen DOM
    const elements = {
        notifikasiContainer: document.getElementById('notifikasi-container'),
        loadingIndicator: document.getElementById('loading'),
        emptyStateIndicator: document.getElementById('empty-state'),
        filterTipe: document.getElementById('filterTipe'),
        filterButton: document.getElementById('filterButton'),
        prevPageBtn: document.getElementById('prevPage'),
        nextPageBtn: document.getElementById('nextPage'),
        currentPageSpan: document.getElementById('currentPage'),
        userNameElement: document.getElementById('userName'),
        markAllReadBtn: document.getElementById('markAllRead')
    }

    // State Aplikasi
    const state = {
        userData: null,
        currentPage: 1,
        totalPages: 1,
        filterTipe: ''
    }

    // Utility Functions
    const utils = {
        // Validasi dan ambil data pengguna
        initializeUser() {
            try {
                const userData = JSON.parse(sessionStorage.getItem('userData'))
                if (!userData) {
                    throw new Error('Tidak ada data pengguna')
                }
                state.userData = userData
                elements.userNameElement.textContent = `Halo ${userData.name}!`
                return true
            } catch (error) {
                console.error('Kesalahan inisialisasi:', error)
                window.location.href = '../Login-Sebagai/index.html'
                return false
            }
        },

        // Format tanggal dengan lokalisasi
        formatTanggal(tanggal) {
            return new Intl.DateTimeFormat('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(new Date(tanggal))
        },

        // Tampilkan pesan error
        showError(message) {
            const errorEl = document.createElement('div')
            errorEl.classList.add('error-message')
            errorEl.textContent = message
            elements.notifikasiContainer.innerHTML = ''
            elements.notifikasiContainer.appendChild(errorEl)
        }
    }

    // Service Notifikasi
    const notifikasiService = {
        // Ambil notifikasi dari backend
        async fetchNotifikasi(page = 1, tipe = '') {
            try {
                const params = new URLSearchParams({
                    page,
                    limit: config.pageSize,
                    tipe
                }).toString()

                const response = await fetch(`${config.apiBaseUrl}/notifikasi?${params}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${state.userData.token}`
                    }
                })

                if (!response.ok) {
                    throw new Error('Gagal mengambil notifikasi')
                }

                return await response.json()
            } catch (error) {
                console.error('Kesalahan fetch notifikasi:', error)
                utils.showError(error.message)
                return null
            }
        },

        // Tandai notifikasi dibaca
        async markNotificationRead(id) {
            try {
                const response = await fetch(`${config.apiBaseUrl}/notifikasi/${id}/dibaca`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${state.userData.token}`
                    }
                })

                return await response.json()
            } catch (error) {
                console.error('Kesalahan tandai dibaca:', error)
                utils.showError('Gagal menandai notifikasi')
                return null
            }
        },

        // Tandai semua notifikasi dibaca
        async markAllNotificationsRead() {
            try {
                const response = await fetch(`${config.apiBaseUrl}/notifikasi/mark-all-read`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${state.userData.token}`
                    }
                })

                return await response.json()
            } catch (error) {
                console.error('Kesalahan tandai semua dibaca:', error)
                utils.showError('Gagal menandai semua notifikasi')
                return null
            }
        }
    }

    // Render Functions
    const renderNotifikasi = {
        // Buat elemen notifikasi
        createNotifikasiElement(notifikasi) {
            const notifikasiEl = document.createElement('div')
            notifikasiEl.classList.add(
                'notifikasi-item', 
                notifikasi.dibaca ? 'dibaca' : 'belum-dibaca'
            )
            
            notifikasiEl.innerHTML = `
                <div class="content">
                    <span class="badge badge-${notifikasi.tipe}">${notifikasi.tipe}</span>
                    <p>${notifikasi.pesan}</p>
                    <small>${utils.formatTanggal(notifikasi.createdAt)}</small>
                </div>
                ${!notifikasi.dibaca ? 
                    `<button class="tandai-dibaca" data-id="${notifikasi.id}">
                        Tandai Dibaca
                    </button>` 
                    : ''}
            `

            // Tambah event listener untuk tombol tandai dibaca
            const tandaiDibacaBtn = notifikasiEl.querySelector('.tandai-dibaca')
            if (tandaiDibacaBtn) {
                tandaiDibacaBtn.addEventListener('click', () => 
                    renderNotifikasi.handleMarkNotificationRead(notifikasi.id)
                )
            }

            return notifikasiEl
        },

        // Render daftar notifikasi
        async renderNotifikasiList(page = 1, tipe = '') {
            // Reset UI
            elements.loadingIndicator.style.display = 'block'
            elements.notifikasiContainer.innerHTML = ''
            elements.emptyStateIndicator.style.display = 'none'
            elements.prevPageBtn.disabled = true
            elements.nextPageBtn.disabled = true

            try {
                const result = await notifikasiService.fetchNotifikasi(page, tipe)

                if (result && result.success) {
                    state.totalPages = result.totalPages || 1
                    state.currentPage = page

                    // Update navigasi
                    elements.currentPageSpan.textContent = `Halaman ${page} dari ${state.totalPages}`
                    elements.prevPageBtn.disabled = page === 1
                    elements.nextPageBtn.disabled = page === state.totalPages

                    // Tampilkan notifikasi
                    if (result.rows.length === 0) {
                        elements.emptyStateIndicator.style.display = 'block'
                    } else {
                        result.rows.forEach(notif => {
                            const notifikasiEl = this.createNotifikasiElement(notif)
                            elements.notifikasiContainer.appendChild(notifikasiEl)
                        })
                    }
                }
            } catch (error) {
                utils.showError('Gagal memuat notifikasi')
            } finally {
                elements.loadingIndicator.style.display = 'none'
            }
        },

        // Handler untuk tombol tandai dibaca
        async handleMarkNotificationRead(id) {
            const result = await notifikasiService.markNotificationRead(id)
            
            if (result && result.success) {
                // Hapus elemen dari DOM const notifikasiEl = document.querySelector(`.tandai-dibaca[data-id="${id}"]`).closest('.notifikasi-item')
                notifikasiEl.remove()

                // Muat ulang notifikasi jika tidak ada yang tersisa
                if (elements.notifikasiContainer.children.length === 0) {
                    this.renderNotifikasiList(state.currentPage, elements.filterTipe.value)
                }
            }
        }
    }

    // Event Listeners
    const setupEventListeners = () => {
        elements.filterButton.addEventListener('click', () => {
            state.currentPage = 1
            renderNotifikasi.renderNotifikasiList(state.currentPage, elements.filterTipe.value)
        })

        elements.prevPageBtn.addEventListener('click', () => {
            if (state.currentPage > 1) {
                renderNotifikasi.renderNotifikasiList(state.currentPage - 1, elements.filterTipe.value)
            }
        })

        elements.nextPageBtn.addEventListener('click', () => {
            if (state.currentPage < state.totalPages) {
                renderNotifikasi.renderNotifikasiList(state.currentPage + 1, elements.filterTipe.value)
            }
        })

        elements.markAllReadBtn.addEventListener('click', async () => {
            const result = await notifikasiService.markAllNotificationsRead()
            if (result && result.success) {
                renderNotifikasi.renderNotifikasiList(state.currentPage, elements.filterTipe.value)
            }
        })
    }

    // Inisialisasi Aplikasi
    const initializeApp = () => {
        if (utils.initializeUser ()) {
            renderNotifikasi.renderNotifikasiList(state.currentPage)
            setupEventListeners()
        }
    }

    // Jalankan inisialisasi
    initializeApp()
})