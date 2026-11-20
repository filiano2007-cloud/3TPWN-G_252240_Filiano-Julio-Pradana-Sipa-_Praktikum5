const isiTabel = document.getElementById("isiTabel");
const inputCari = document.getElementById("cari");
const totalBuku = document.getElementById("totalBuku");
const terpilih = document.getElementById("terpilih");

function perbaruiTotal() {
    const baris = isiTabel.querySelectorAll("tr:not([hidden])");
    totalBuku.textContent = "Total judul: " + baris.length;
}

perbaruiTotal();

inputCari.addEventListener("input", function () {
    const kata = inputCari.value.trim().toLowerCase();
    const semuaBaris = isiTabel.querySelectorAll("tr");

    for (let i = 0; i < semuaBaris.length; i++) {
        const judul = semuaBaris[i].cells[0].textContent.toLowerCase();
        const penulis = semuaBaris[i].cells[1].textContent.toLowerCase();
        semuaBaris[i].hidden = !(judul.includes(kata) || penulis.includes(kata));
    }

    perbaruiTotal();
});

isiTabel.addEventListener("click", function (event) {
    const baris = event.target.closest("tr");

    if (baris === null) {
        return;
    }

    const aktif = baris.classList.toggle("dipilih");
    terpilih.textContent = aktif
        ? "Dipilih: " + baris.cells[0].textContent
        : "Dipilih: -";
});

const tombolMenipis = document.getElementById("tombolMenipis");

tombolMenipis.addEventListener("click", function () {
    const semuaBaris = isiTabel.querySelectorAll("tr");

    for (let i = 0; i < semuaBaris.length; i++) {
        const stok = Number(semuaBaris[i].cells[4].textContent);
        semuaBaris[i].classList.toggle("menipis", stok <= 3);
    }
});

const tombolHapus = document.getElementById("tombolHapus");

tombolHapus.addEventListener("click", function () {
    const barisDipilih = isiTabel.querySelectorAll("tr.dipilih");

    for (let i = 0; i < barisDipilih.length; i++) {
        barisDipilih[i].remove();
    }

    terpilih.textContent = "Dipilih: -";
    perbaruiTotal();
});

const formBuku = document.getElementById("formBuku");

function buatBaris(data) {
    const baris = document.createElement("tr");

    for (let i = 0; i < data.length; i++) {
        const sel = document.createElement("td");
        sel.textContent = data[i];
        baris.appendChild(sel);
    }

    return baris;
}

const inputJudul = document.getElementById("judul");
const inputPenulis = document.getElementById("penulis");
const inputTahun = document.getElementById("tahun");
const inputStok = document.getElementById("stok");
const kotakError = document.getElementById("pesanError");
const pesanSukses = document.getElementById("pesanSukses");

// 7. Periksa teks: kosong, panjang minimal, lalu duplikat
function judulSudahAda(nilai) {
    const semuaBaris = isiTabel.querySelectorAll("tr");

    for (let i = 0; i < semuaBaris.length; i++) {
        const judul = semuaBaris[i].cells[0].textContent;

        if (judul.toLowerCase() === nilai.toLowerCase()) {
            return true;
        }
    }

    return false;
}

function cekJudul(nilai) {
    if (nilai === "") {
        return "Judul wajib diisi.";
    }

    if (nilai.length < 3) {
        return "Judul minimal 3 karakter.";
    }

    if (judulSudahAda(nilai)) {
        return "Judul sudah ada di katalog.";
    }

    return "";
}

function cekPenulis(nilai) {
    if (nilai === "") {
        return "Penulis wajib diisi.";
    }

    if (nilai.length < 3) {
        return "Penulis minimal 3 karakter.";
    }

    for (let i = 0; i < nilai.length; i++) {
        const karakter = nilai[i];

        if (karakter !== " " && !isNaN(karakter)) {
            return "Penulis tidak boleh berisi angka.";
        }
    }

    return "";
}

function cekTahun(nilai) {
    const angka = Number(nilai);
    const tahunIni = new Date().getFullYear();

    if (nilai === "") {
        return "Tahun wajib diisi.";
    }

    if (!Number.isInteger(angka)) {
        return "Tahun harus berupa angka bulat.";
    }

    if (angka < 1900 || angka > tahunIni) {
        return "Tahun harus antara 1900 dan " + tahunIni + ".";
    }

    return "";
}

function cekStok(nilai) {
    const angka = Number(nilai);

    if (nilai === "") {
        return "Stok wajib diisi.";
    }

    if (!Number.isInteger(angka)) {
        return "Stok harus berupa angka bulat.";
    }

    if (angka < 0) {
        return "Stok tidak boleh negatif.";
    }

    return "";
}

function validasiForm() {
    const kolom = [
        { input: inputJudul, cek: cekJudul },
        { input: inputPenulis, cek: cekPenulis },
        { input: inputTahun, cek: cekTahun },
        { input: inputStok, cek: cekStok }
    ];
    const daftarError = [];

    for (let i = 0; i < kolom.length; i++) {
        const pesan = kolom[i].cek(kolom[i].input.value.trim());

        kolom[i].input.classList.toggle("salah", pesan !== "");

        if (pesan !== "") {
            daftarError.push(pesan);
        }
    }

    return daftarError;
}

function tampilkanError(daftarError) {
    kotakError.innerHTML = "";

    daftarError.forEach(function (pesan) {
        const item = document.createElement("li");
        item.textContent = pesan;
        kotakError.appendChild(item);
    });
}

const tombolTambah = formBuku.querySelector("button[type='submit']");
const BATAS_GAGAL = 3;
let gagalBerturut = 0;

formBuku.addEventListener("submit", function (event) {
    event.preventDefault();

    const daftarError = validasiForm();
    tampilkanError(daftarError);

    if (daftarError.length > 0) {
        pesanSukses.textContent = "";

        gagalBerturut++;

        if (gagalBerturut >= BATAS_GAGAL) {
            tombolTambah.disabled = true;
            const item = document.createElement("li");
            item.textContent = "Gagal " + BATAS_GAGAL + " kali berturut-turut. Tombol Tambah dinonaktifkan; refresh halaman untuk mencoba lagi.";
            kotakError.appendChild(item);
        }

        return;
    }

    gagalBerturut = 0;

    const data = [
        inputJudul.value.trim(),
        inputPenulis.value.trim(),
        document.getElementById("kategori").value,
        inputTahun.value.trim(),
        inputStok.value.trim()
    ];

    isiTabel.appendChild(buatBaris(data));
    pesanSukses.textContent = "Buku ditambahkan: " + data[0];
    formBuku.reset();
    perbaruiTotal();
});