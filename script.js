// Data Menu Awal (Termasuk item Bengbeng dari pengguna dan varian menu per kategori)
const INITIAL_MENUS = [
    {
        id: 1,
        nama: "Bengbeng",
        kategori: "Snack",
        harga: 3000,
        gambar: "https://i.ibb.co.com/dsj07cqh/Beng-Beng-Regular2.png",
        deskripsi: "Bengbeng rasa coklat lezat renyah berkaramel."
    }
];

// Muat data dari localStorage jika ada, jika belum ada gunakan data default
let daftarMenu = [];
try {
    const saved = localStorage.getItem("kantin_mtu_menus");
    if (saved) {
        daftarMenu = JSON.parse(saved);
    } else {
        daftarMenu = [...INITIAL_MENUS];
        localStorage.setItem("kantin_mtu_menus", JSON.stringify(daftarMenu));
    }
} catch (e) {
    daftarMenu = [...INITIAL_MENUS];
}

let kategoriAktif = "Semua";

// Render daftar menu ke dalam grid
function renderMenu(menus) {
    const grid = document.getElementById("menu-grid");
    if (!grid) return;

    grid.innerHTML = "";

    if (menus.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-12 px-4 bg-white rounded-2xl border border-gray-100 shadow-xs">
                <span class="text-3xl block mb-2">🍽️</span>
                <p class="text-sm font-semibold text-gray-700">Belum ada menu di kategori "${kategoriAktif}"</p>
                <p class="text-xs text-gray-400 mt-1">Gunakan tombol "Tambah Menu Baru" untuk menambahkan menu di kategori ini.</p>
            </div>
        `;
        return;
    }

    menus.forEach(item => {
        const card = document.createElement("div");
        card.className = "bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col justify-between group";

        const fallbackImg = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80";
        const gambarSrc = item.gambar && item.gambar.trim() !== "" ? item.gambar : fallbackImg;

        card.innerHTML = `
            <div class="flex flex-col h-full">
                <div class="h-40 sm:h-44 overflow-hidden bg-gray-100 relative">
                    <img src="${gambarSrc}" 
                         alt="${item.nama}" 
                         loading="lazy"
                         class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                         onerror="this.onerror=null; this.src='${fallbackImg}';">
                    <span class="absolute top-2.5 right-2.5 bg-black/65 backdrop-blur-xs text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg tracking-wide shadow-xs">
                        ${item.kategori}
                    </span>
                </div>
                <div class="p-3.5 sm:p-4 flex flex-col justify-between flex-grow">
                    <div>
                        <h3 class="font-bold text-gray-900 text-sm sm:text-base leading-snug line-clamp-2 mb-1">${item.nama}</h3>
                        ${item.deskripsi ? `<p class="text-xs text-gray-500 line-clamp-2 mb-2 leading-relaxed">${item.deskripsi}</p>` : ''}
                    </div>
                    <div class="pt-2 border-t border-gray-50 flex items-center justify-between mt-auto">
                        <span class="text-emerald-700 font-extrabold text-sm sm:text-base">
                            Rp ${Number(item.harga).toLocaleString('id-ID')}
                        </span>
                        <span class="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-medium">
                            Tersedia
                        </span>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Filter menu berdasarkan kategori
function filterMenu(kategori) {
    kategoriAktif = kategori;

    document.querySelectorAll(".filter-btn").forEach(btn => {
        const text = btn.innerText.trim();
        if (text === kategori || (kategori === "Semua" && text.includes("Semua"))) {
            btn.className = "filter-btn shrink-0 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-700 text-white transition shadow-sm";
        } else {
            btn.className = "filter-btn shrink-0 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 transition";
        }
    });

    let hasilFilter = kategori === "Semua" ? daftarMenu : daftarMenu.filter(item => item.kategori === kategori);
    renderMenu(hasilFilter);
}

// Buka/Tutup Mobile Menu Hamburger Drawer
function toggleMobileMenu() {
    const menu = document.getElementById("mobile-menu");
    const btn = document.getElementById("hamburger-btn");
    if (!menu || !btn) return;

    const isHidden = menu.classList.contains("hidden");
    if (isHidden) {
        menu.classList.remove("hidden");
        btn.classList.add("hamburger-active");
        btn.setAttribute("aria-expanded", "true");
    } else {
        closeMobileMenu();
    }
}

function closeMobileMenu() {
    const menu = document.getElementById("mobile-menu");
    const btn = document.getElementById("hamburger-btn");
    if (menu) menu.classList.add("hidden");
    if (btn) {
        btn.classList.remove("hamburger-active");
        btn.setAttribute("aria-expanded", "false");
    }
}

// Buka/Tutup Modal Dashboard Admin
function toggleAdminModal() {
    const modal = document.getElementById("admin-modal");
    if (modal) {
        modal.classList.toggle("hidden");
    }
}

// Buka/Tutup Modal Tentang Kantin MTU
function toggleAboutModal() {
    const modal = document.getElementById("about-modal");
    if (modal) {
        modal.classList.toggle("hidden");
    }
}

// Live Image Preview saat menginput URL gambar langsung (direct link)
function handleImagePreview(url) {
    const previewContainer = document.getElementById("image-preview-container");
    const previewImg = document.getElementById("image-preview-element");
    const previewUrlText = document.getElementById("preview-url-text");

    if (!previewContainer || !previewImg) return;

    const trimmed = url.trim();
    if (trimmed !== "" && (trimmed.startsWith("http://") || trimmed.startsWith("https://"))) {
        previewImg.src = trimmed;
        if (previewUrlText) previewUrlText.textContent = trimmed;
        previewContainer.classList.remove("hidden");

        previewImg.onerror = () => {
            previewImg.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80";
            if (previewUrlText) previewUrlText.textContent = "Link tidak dapat dimuat, menggunakan placeholder.";
        };
    } else {
        previewContainer.classList.add("hidden");
        previewImg.src = "";
    }
}

// Tangani penambahan menu baru dari form modal
function handleAddNewMenu(event) {
    event.preventDefault();
    const nama = document.getElementById("input-nama").value.trim();
    const kategori = document.getElementById("input-kategori").value;
    const harga = parseInt(document.getElementById("input-harga").value, 10);
    const gambar = document.getElementById("input-gambar").value.trim();
    const deskripsi = document.getElementById("input-deskripsi").value.trim();

    const menuBaru = {
        id: Date.now(),
        nama,
        kategori,
        harga,
        gambar: gambar !== "" ? gambar : undefined,
        deskripsi: deskripsi !== "" ? deskripsi : undefined
    };

    daftarMenu.unshift(menuBaru); // Masukkan menu baru di posisi paling atas

    // Simpan ke localStorage agar tidak hilang saat di-refresh
    try {
        localStorage.setItem("kantin_mtu_menus", JSON.stringify(daftarMenu));
    } catch (e) {
        console.warn("Gagal menyimpan ke localStorage", e);
    }

    // Reset Form & Preview
    document.getElementById("add-menu-form").reset();
    handleImagePreview("");

    // Tutup Modal & Segarkan Tampilan
    toggleAdminModal();
    filterMenu(kategoriAktif);

    // Tampilkan notifikasi ramah
    alert(`Menu "${nama}" berhasil ditambahkan ke kategori ${kategori}!`);
}

// Tutup menu mobile ketika klik di luar header
document.addEventListener("click", (e) => {
    const header = document.querySelector("header");
    const mobileMenu = document.getElementById("mobile-menu");
    if (header && mobileMenu && !header.contains(e.target) && !mobileMenu.classList.contains("hidden")) {
        closeMobileMenu();
    }
});

// Tutup modal dengan tombol Escape
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        const adminModal = document.getElementById("admin-modal");
        const aboutModal = document.getElementById("about-modal");
        if (adminModal && !adminModal.classList.contains("hidden")) toggleAdminModal();
        if (aboutModal && !aboutModal.classList.contains("hidden")) toggleAboutModal();
        closeMobileMenu();
    }
});

// Inisialisasi tampilan saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
    renderMenu(daftarMenu);
});
