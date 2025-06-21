
const tableUrl = 'wbgt_table_preciso.json';
let wbgtData = {};
fetch(tableUrl).then(r => r.json()).then(d => wbgtData = d);

const translations = {
    pt: { title: "Verificador WBGT (Manual)", labelTemp: "Temperatura (°C):", labelHum: "Umidade (%):", calc: "Calcular", clear: "Limpar", mode: "Modo Escuro", levels: ["Quase seguro", "Atenção", "Alerta", "Alerta severo", "Perigo"] },
    en: { title: "WBGT Checker (Manual)", labelTemp: "Temperature (°C):", labelHum: "Humidity (%):", calc: "Calculate", clear: "Clear", mode: "Dark Mode", levels: ["Almost Safe", "Caution", "Warning", "Severe Alert", "Danger"] },
    jp: { title: "WBGTチェッカー（手動）", labelTemp: "気温 (°C):", labelHum: "湿度 (%):", calc: "計算", clear: "クリア", mode: "ダークモード", levels: ["ほぼ安全", "注意", "警戒", "厳重警戒", "危険"] },
    id: { title: "Pemeriksa WBGT (Manual)", labelTemp: "Suhu (°C):", labelHum: "Kelembapan (%):", calc: "Hitung", clear: "Bersihkan", mode: "Mode Gelap", levels: ["Hampir Aman", "Waspada", "Siaga", "Siaga Berat", "Bahaya"] }
};

document.getElementById("calculate").onclick = () => {
    const temp = document.getElementById("temperature").value;
    const hum = document.getElementById("humidity").value;
    if (!wbgtData[temp] || !wbgtData[temp][hum]) return;

    const wbgt = wbgtData[temp][hum];
    const lang = document.getElementById("language-select").value;

    const [label, color] = wbgt < 21 ? [0, "#538DD5"] :
                           wbgt <= 24 ? [1, "#C5D9F1"] :
                           wbgt <= 27 ? [2, "#FFFF00"] :
                           wbgt <= 30 ? [3, "#FFC000"] :
                                        [4, "#FF0000"];

    const t = translations[lang];
    const box = document.getElementById("result-box");
    box.classList.remove("hidden");
    box.style.backgroundColor = color;
    box.innerHTML = `<div>WBGT: ${wbgt}°C<br><strong>${t.levels[label]}</strong></div>`;
};

document.getElementById("clear").onclick = () => {
    document.getElementById("temperature").value = "";
    document.getElementById("humidity").value = "";
    document.getElementById("result-box").classList.add("hidden");
};

document.getElementById("language-select").onchange = (e) => {
    const lang = e.target.value;
    const t = translations[lang];
    document.getElementById("title").innerText = t.title;
    document.getElementById("label-temp").innerText = t.labelTemp;
    document.getElementById("label-hum").innerText = t.labelHum;
    document.getElementById("calculate").innerText = t.calc;
    document.getElementById("clear").innerText = t.clear;
    document.getElementById("darkmode-label").innerText = t.mode;
};

document.getElementById("darkmode-toggle").onchange = (e) => {
    document.body.classList.toggle("dark", e.target.checked);
};
