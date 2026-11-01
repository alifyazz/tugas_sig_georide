// Import library dari croot.js.org
import { map } from 'https://croot.js.org/croot.js';

// 1. Inisialisasi Peta
// Koordinat diset agar terpusat di area ULBI berdasarkan data koordinat [107.575657, -6.874506]
const myMap = map('map').setView([-6.874506, 107.575657], 16);

// 2. Mengambil data file rute_kampus.geojson
fetch('rute_kampus.geojson') //
    .then(response => response.json())
    .then(data => {
        // 3. Render GeoJSON ke dalam Peta
        // Fungsi croot untuk menampilkan polyline jalan dan polygon gedung
        // Dokumentasikan bagian ini di artikel Medium menyesuaikan syntax croot.js
        console.log("Data peta berhasil dimuat:", data);
        
        // Contoh implementasi (sesuaikan dengan croot):
        // croot.geoJson(data).addTo(myMap);
    })
    .catch(error => console.error('Gagal memuat data rute:', error));

// 4. Logika Perhitungan Tarif Minimal 10 Ribu
function calculateFare(distanceInKm) {
    let baseFare = 5000;
    let perKmRate = 2000;
    let total = baseFare + (distanceInKm * perKmRate);
    
    // Syarat wajib: Minimal ongkos 10 ribu
    if (total < 10000) {
        total = 10000;
    }
    return total;
}

// Menampilkan tarif di UI
const finalFare = calculateFare(1.5); // Anggap jarak 1.5 km
document.getElementById('fare-price').innerText = `Rp ${finalFare.toLocaleString('id-ID')}`;

// 5. Interaksi Tombol UI
document.getElementById('btn-pesan').addEventListener('click', () => {
    alert('Mencari driver di sekitar Pasar Cibogo untuk rute ke ULBI...');
});