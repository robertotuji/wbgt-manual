let translations = {
  ja: {
    title: "WBGTチェッカー（手動）",
    labelTemp: "気温 (℃):",
    labelHum: "湿度 (%):",
    calculate: "計算",
    clear: "クリア",
    darkMode: "ダークモード",
    wbgtLabel: "WBGT値:",
    levels: [
      { max: 21, color: "#538DD5", text: "ほぼ安全" },
      { max: 25, color: "#C5D9F1", text: "注意" },
      { max: 28, color: "#FFFF00", text: "警戒" },
      { max: 31, color: "#FFC000", text: "厳重警戒" },
      { max: Infinity, color: "#FF0000", text: "危険" }
    ]
  },
  pt: {
    title: "Verificador WBGT (Manual)",
    labelTemp: "Temperatura (°C):",
    labelHum: "Umidade (%):",
    calculate: "Calcular",
    clear: "Limpar",
    darkMode: "Modo Escuro",
    wbgtLabel: "Valor WBGT:",
    levels: [
      { max: 21, color: "#538DD5", text: "Seguro" },
      { max: 25, color: "#C5D9F1", text: "Atenção" },
      { max: 28, color: "#FFFF00", text: "Cuidado" },
      { max: 31, color: "#FFC000", text: "Alerta Máximo" },
      { max: Infinity, color: "#FF0000", text: "Perigo" }
    ]
  },
  en: {
    title: "WBGT Checker (Manual)",
    labelTemp: "Temperature (°C):",
    labelHum: "Humidity (%):",
    calculate: "Calculate",
    clear: "Clear",
    darkMode: "Dark Mode",
    wbgtLabel: "WBGT Value:",
    levels: [
      { max: 21, color: "#538DD5", text: "Safe" },
      { max: 25, color: "#C5D9F1", text: "Caution" },
      { max: 28, color: "#FFFF00", text: "Warning" },
      { max: 31, color: "#FFC000", text: "High Alert" },
      { max: Infinity, color: "#FF0000", text: "Danger" }
    ]
  },
  id: {
    title: "Pemeriksa WBGT (Manual)",
    labelTemp: "Suhu (°C):",
    labelHum: "Kelembaban (%):",
    calculate: "Hitung",
    clear: "Hapus",
    darkMode: "Mode Gelap",
    wbgtLabel: "Nilai WBGT:",
    levels: [
      { max: 21, color: "#538DD5", text: "Aman" },
      { max: 25, color: "#C5D9F1", text: "Hati-hati" },
      { max: 28, color: "#FFFF00", text: "Waspada" },
      { max: 31, color: "#FFC000", text: "Waspada Tinggi" },
      { max: Infinity, color: "#FF0000", text: "Bahaya" }
    ]
  }
};

let lang = "ja";

function changeLanguage() {
  lang = document.getElementById("language-select").value;
  const t = translations[lang];
  document.getElementById("title").innerText = t.title;
  document.getElementById("label-temp").innerText = t.labelTemp;
  document.getElementById("label-humidity").innerText = t.labelHum;
  document.getElementById("calculate-btn").innerText = t.calculate;
  document.getElementById("clear-btn").innerText = t.clear;
  document.getElementById("theme-label").innerText = t.darkMode;
}

function calculateWBGT() {
  const temp = parseInt(document.getElementById("temperature").value);
  const hum = parseInt(document.getElementById("humidity").value);
  const t = translations[lang];
  let wbgt = "N/A";
  if (!isNaN(temp) && !isNaN(hum)) {
    wbgt = getWBGTValue(temp, hum);
    const level = t.levels.find(l => wbgt < l.max);
    const result = document.getElementById("result");
    result.innerHTML = `<strong>${t.wbgtLabel} ${wbgt}°C<br>${level.text}</strong>`;
    result.style.backgroundColor = level.color;
    document.getElementById("result-box").style.display = "block";
  }
}

function getWBGTValue(temp, hum) {
  if (temp >= 30 && hum >= 60) return 28;
  if (temp >= 25 && hum >= 50) return 26;
  if (temp >= 20 && hum >= 40) return 22;
  return 21;
}

function clearFields() {
  document.getElementById("temperature").value = "";
  document.getElementById("humidity").value = "";
  document.getElementById("result-box").style.display = "none";
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
}