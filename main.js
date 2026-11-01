// Mengimpor modul peta dan modul elemen DOM dari CDN resmi Croot.js
import { map } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.23/map.js";
import { setInner, onClick } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.23/element.min.js";

// 1. Inisialisasi Peta
// Mengarahkan titik tengah peta ke koordinat ULBI
const myMap = map("map").setView([-6.874506, 107.575657], 16);

// 2. Memuat dan Menampilkan Data rute_kampus.geojson
fetch("rute_kampus.geojson")
    .then(response => response.json())
    .then(data => {
        console.log("Data GeoJSON berhasil dimuat:", data);
        
        // Memasukkan data GeoJSON ke dalam peta
        // (Catatan: croot.js menggunakan basis Leaflet, jadi metode standarnya seperti ini)
        L.geoJSON(data, {
            style: function (feature) {
                // Memberikan warna khusus jika tipe datanya berupa garis rute (LineString)
                if (feature.geometry.type === 'LineString') {
                    return { color: '#F88379', weight: 5, opacity: 0.8 };
                }
                // Memberikan warna abu-abu untuk area poligon (Gedung)
                return { color: '#2D3748', weight: 1, fillColor: '#CBD5E0', fillOpacity: 0.6 };
            }
        }).addTo(myMap);
    })
    .catch(error => console.error("Gagal memuat rute_kampus.geojson:", error));

// 3. Logika Perhitungan Tarif Minimal
function calculateFare(distanceInKm) {
    let baseFare = 5000;
    let ratePerKm = 2000;
    let total = baseFare + (distanceInKm * ratePerKm);
    
    // Syarat tugas: Tarif minimal Rp 10.000
    if (total < 10000) {
        total = 10000;
    }
    return total;
}

// 4. Menerapkan Logika ke Antarmuka menggunakan fungsi Croot.js
const distanceToULBI = 1.5; // Contoh simulasi jarak tempuh 1.5 km
const finalFare = calculateFare(distanceToULBI);

// Menggunakan setInner dari croot.js untuk mengubah teks harga di HTML
setInner("fare-price", `Rp ${finalFare.toLocaleString('id-ID')}`);

// Menggunakan onClick dari croot.js untuk interaksi tombol pemesanan
onClick("btn-pesan", () => {
    alert("Sedang mencari driver di sekitar Pasar Cibogo untuk rute menuju ULBI...");
});