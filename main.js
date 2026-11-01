// 1. GANTI BARIS INI DENGAN SINTAKS IMPORT DARI WEB CROOT.JS.ORG
import { map } from 'URL_YANG_ADA_DI_DOKUMENTASI_CROOT_JS'; 

// 2. Inisialisasi peta pada koordinat tujuan (ULBI)
const myMap = map('map').setView([-6.874506, 107.575657], 16);

// 3. Mengambil dan menampilkan data rute_kampus.geojson
fetch('rute_kampus.geojson')
    .then(response => response.json())
    .then(data => {
        // GANTI BARIS INI: Gunakan fungsi dari dokumentasi croot.js untuk memuat data JSON ke peta
        console.log("Data peta dimuat:", data);
        // croot.geoJson(data).addTo(myMap); <-- Sesuaikan dengan dokumentasi
    })
    .catch(error => console.error('Gagal memuat rute:', error));

// 4. Logika tarif minimal 10.000
function calculateFare(distanceInKm) {
    let total = 5000 + (distanceInKm * 2000);
    return total < 10000 ? 10000 : total; // Syarat mutlak dari dosen
}

document.getElementById('fare-price').innerText = `Rp ${calculateFare(1.5).toLocaleString('id-ID')}`;

document.getElementById('btn-pesan').addEventListener('click', () => {
    alert('Mencari driver terdekat...');
});