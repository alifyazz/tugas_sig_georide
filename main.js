// Semua fungsi peta diimpor dari Croot.js (versi di-pin sesuai conventions)
import { createMap, addGeoJSON, fitMap, getGeoJSON } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/map.js";

// Alamat file data, dihitung relatif terhadap main.js
const URL_DATA = new URL("rute_kampus.geojson", import.meta.url).href;

// 1) Buat peta di <div id="peta">, pakai peta dasar OpenStreetMap bawaan Croot.js
createMap("peta", { center: [107.577, -6.878], zoom: 15 });

// ---------- Fungsi bantu (JavaScript biasa, bukan Croot.js) ----------

function setStatus(teks) {
    const el = document.getElementById("status");
    el.textContent = teks;
    el.hidden = !teks;
}


// Jarak dua titik [lng, lat] dalam meter (rumus Haversine)
function hitungJarak(a, b) {
    const R = 6371000;
    const rad = (derajat) => (derajat * Math.PI) / 180;
    const dLat = rad(b[1] - a[1]);
    const dLng = rad(b[0] - a[0]);
    const h =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(rad(a[1])) * Math.cos(rad(b[1])) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
}

function panjangGaris(koordinat) {
    let total = 0;
    for (let i = 1; i < koordinat.length; i++) {
        total += hitungJarak(koordinat[i - 1], koordinat[i]);
    }
    return total;
}

function formatJarak(meter) {
    if (meter >= 1000) {
        return (meter / 1000).toFixed(2).replace(".", ",") + " km";
    }
    return Math.round(meter) + " m";
}

// Posisi GeoJSON [lng, lat] ditampilkan sebagai "lat, lng"
function formatKoordinat(posisi) {
    return posisi[1].toFixed(5) + ", " + posisi[0].toFixed(5);
}

// ---------- Menampilkan rute ----------

function tampilkanRute(data) {
    // Ambil hanya garis (LineString); titik penanda "Sarijadi" tidak ikut digambar
    const garis = data.features.filter(
        (f) => f.geometry && f.geometry.type === "LineString"
    );

    if (garis.length === 0) {
        setStatus("Tidak ada LineString di file GeoJSON.");
        return;
    }

    const rute = { type: "FeatureCollection", features: garis };

    // 2) Gambar rute ala GPS: garis hitam tebal sebagai tepi, lalu garis kuning di atasnya
    addGeoJSON("peta", rute, {
        style: { stroke: "#000000", strokeWidth: 11, strokeOpacity: 0.85 },
        popup: false,
    });
    addGeoJSON("peta", rute, {
        style: { stroke: "#ffd400", strokeWidth: 5 },
        popup: (feature) => feature.properties.label || "Ruas rute",
    });

    // 3) Penanda awal (biru) dan tujuan (ungu)
    // Asumsi: urutan fitur di file = arah perjalanan
    const awal = garis[0].geometry.coordinates[0];
    const koordinatAkhir = garis[garis.length - 1].geometry.coordinates;
    const akhir = koordinatAkhir[koordinatAkhir.length - 1];

    addGeoJSON("peta", { type: "Point", coordinates: awal }, {
        style: { fill: "#38bdf8", stroke: "#ffffff", strokeWidth: 3, radius: 9 },
        popup: () => "Titik awal",
    });
    addGeoJSON("peta", { type: "Point", coordinates: akhir }, {
        style: { fill: "#d946ef", stroke: "#ffffff", strokeWidth: 3, radius: 11 },
        popup: () => "Titik tujuan",
    });

    // 4) Fokuskan peta ke seluruh rute (padding 80 piksel)
    fitMap("peta", rute, 80);

    isiPanel(garis, awal, akhir);
    setStatus("");
}

function isiPanel(garis, awal, akhir) {
    let totalMeter = 0;
    let totalTitik = 0;
    const daftar = document.getElementById("daftarRuas");
    daftar.textContent = "";

    garis.forEach((fitur, i) => {
        const koordinat = fitur.geometry.coordinates;
        const meter = panjangGaris(koordinat);
        totalMeter += meter;
        totalTitik += koordinat.length;

        const li = document.createElement("li");
        const nama = document.createElement("span");
        const jarak = document.createElement("span");
        jarak.className = "ruas-jarak";
        nama.textContent = fitur.properties.label || "Ruas " + (i + 1);
        jarak.textContent = formatJarak(meter);
        li.append(nama, jarak);
        daftar.appendChild(li);
    });

    document.getElementById("koorAwal").textContent = formatKoordinat(awal);
    document.getElementById("koorAkhir").textContent = formatKoordinat(akhir);
    document.getElementById("statJarak").textContent = formatJarak(totalMeter);
    const elMeter = document.getElementById("statJarakMeter");
    if (elMeter) elMeter.textContent = Math.round(totalMeter) + " meter";
    document.getElementById("statRuas").textContent = garis.length;
    document.getElementById("statTitik").textContent = totalTitik;
}

// ---------- Memuat file GeoJSON ----------

getGeoJSON(URL_DATA, (response) => {
    if (response.status === 0) {
        console.log("Gagal mengambil file:", URL_DATA);
        setStatus("Gagal memuat data. Buka halaman lewat Live Server, bukan klik dua kali file.");
        return;
    }
    if (!response.data) {
        console.log("Bukan GeoJSON, status:", response.status);
        setStatus("File tidak terbaca sebagai GeoJSON (status " + response.status + ").");
        return;
    }
    tampilkanRute(response.data);
});