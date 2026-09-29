// ==========================================
// 1. INISIALISASI & AMBIL DATA DARI LOCALSTORAGE
// ==========================================

// Ambil data siswa dari LocalStorage. Jika belum ada, gunakan array kosong []
let students = JSON.parse(localStorage.getItem("students")) || [];

// Variabel penanda apakah kita sedang dalam mode "edit" (menyimpan ID siswa yang sedang diedit)
let editId = null;

// Mengambil elemen-elemen DOM yang kita butuhkan
const studentForm = document.getElementById("studentForm");
const nameInput = document.getElementById("name");
const scoreInput = document.getElementById("score");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formTitle = document.getElementById("formTitle");
const studentList = document.getElementById("studentList");
const totalStudentsEl = document.getElementById("totalStudents");
const averageScoreEl = document.getElementById("averageScore");
const alertMessage = document.getElementById("alertMessage");

// Timer untuk menyembunyikan alert otomatis
let alertTimeout;


// ==========================================
// 2. FUNGSI UTAMA (SIMPAN, RENDER, ALERT)
// ==========================================

// Fungsi untuk menyimpan array 'students' ke LocalStorage
function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

// Fungsi untuk memperbarui tampilan UI (Daftar Siswa + Statistik)
function renderStudents() {
    // Kosongkan area daftar siswa terlebih dahulu
    studentList.innerHTML = "";

    // Jika data siswa kosong
    if (students.length === 0) {
        studentList.innerHTML = `<p class="empty-text">Belum ada data siswa.</p>`;
    } else {
        // Tampilkan setiap siswa ke dalam HTML
        students.forEach((student, index) => {
            const item = document.createElement("div");
            item.classList.add("student-item");
            
            item.innerHTML = `
                <div class="student-info">
                    <p>${index + 1}. ${student.name}</p>
                    <span>Nilai: ${student.score}</span>
                </div>
                <div class="action-btns">
                    <button class="btn-edit" onclick="editStudent(${student.id})">✏️ Ubah</button>
                    <button class="btn-delete" onclick="deleteStudent(${student.id})">🗑️ Hapus</button>
                </div>
            `;
            
            studentList.appendChild(item);
        });
    }

    // Perbarui Statistik
    updateStats();
}

// Fungsi untuk menghitung Total dan Rata-rata Nilai
function updateStats() {
    const total = students.length;
    totalStudentsEl.textContent = total;

    if (total === 0) {
        averageScoreEl.textContent = "0";
        return;
    }

    // Hitung jumlah seluruh nilai menggunakan loop
    let totalScore = 0;
    for (let i = 0; i < students.length; i++) {
        totalScore += Number(students[i].score);
    }

    // Hitung rata-rata (dibulatkan max 1 angka di belakang koma)
    const avg = (totalScore / total).toFixed(1);
    averageScoreEl.textContent = avg;
}

// Fungsi untuk menampilkan pesan Alert Notification
function showAlert(message) {
    alertMessage.textContent = message;
    alertMessage.classList.remove("hidden");
    alertMessage.classList.add("show");

    // Hapus timer lama jika ada, lalu atur timer baru agar alert hilang setelah 3 detik
    clearTimeout(alertTimeout);
    alertTimeout = setTimeout(() => {
        alertMessage.classList.remove("show");
        alertMessage.classList.add("hidden");
    }, 3000);
}


// ==========================================
// 3. FITUR CRUD (CREATE, UPDATE, DELETE)
// ==========================================

// Event Listener saat Form disubmit (Bisa Tambah Baru ATAU Update)
studentForm.addEventListener("submit", function (event) {
    // Mencegah browser dari refresh halaman secara otomatis
    event.preventDefault();

    const nameValue = nameInput.value.trim();
    const scoreValue = Number(scoreInput.value);

    // Cek apakah sedang dalam Mode Edit atau Mode Tambah Baru
    if (editId !== null) {
        // --- PROSES UPDATE ---
        // Cari siswa berdasarkan id
        const student = students.find((s) => s.id === editId);
        if (student) {
            student.name = nameValue;
            student.score = scoreValue;
        }

        showAlert(`🔄 Data siswa ${nameValue} berhasil diperbarui.`);
        resetForm();
    } else {
        // --- PROSES TAMBAH (CREATE) ---
        const newStudent = {
            id: Date.now(), // Menggunakan timestamp unik sebagai ID
            name: nameValue,
            score: scoreValue
        };

        students.push(newStudent);
        showAlert(`✅ Data siswa ${nameValue} berhasil ditambahkan.`);
        resetForm();
    }

    // Simpan ke LocalStorage dan Render ulang antarmuka
    saveStudents();
    renderStudents();
});

// Fungsi untuk menyiapkan form masuk ke "Mode Edit"
function editStudent(id) {
    const student = students.find((s) => s.id === id);
    if (!student) return;

    // Isi form dengan data siswa yang dipilih
    nameInput.value = student.name;
    scoreInput.value = student.score;

    // Ubah status ke Mode Edit
    editId = id;
    formTitle.textContent = "✏️ Edit Siswa";
    submitBtn.textContent = "💾 Update Siswa";
    cancelBtn.classList.remove("hidden");

    // Fokuskan kursor ke input nama
    nameInput.focus();
}

// Fungsi Batal Edit
cancelBtn.addEventListener("click", resetForm);

// Fungsi untuk mengembalikan form ke kondisi awal (Mode Tambah)
function resetForm() {
    studentForm.reset();
    editId = null;
    formTitle.textContent = "➕ Tambah Siswa";
    submitBtn.textContent = "➕ Tambah Siswa";
    cancelBtn.classList.add("hidden");
}

// Fungsi Hapus Siswa (DELETE) dengan Konfirmasi Dialog
function deleteStudent(id) {
    // Cari siswa yang akan dihapus untuk mengambil namanya dalam dialog
    const student = students.find((s) => s.id === id);
    if (!student) return;

    // Tampilkan Confirm Dialog
    const isConfirmed = confirm(`Apakah kamu yakin ingin menghapus siswa ${student.name}?`);

    if (isConfirmed) {
        // Filter array: simpan siswa yang ID-nya TIDAK SAMA dengan id yang dihapus
        students = students.filter((s) => s.id !== id);

        // Jika siswa yang sedang diedit ternyata dihapus, reset form
        if (editId === id) {
            resetForm();
        }

        saveStudents();
        renderStudents();
        showAlert(`🗑️ Data siswa ${student.name} berhasil dihapus.`);
    }
}


// ==========================================
// 4. JALANKAN PROGRAM PERTAMA KALI
// ==========================================
renderStudents();