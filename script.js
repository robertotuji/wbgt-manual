
document.addEventListener("DOMContentLoaded", function () {
    const translations = {
        "pt": {
            title: "Verificador WBGT (Manual)",
            temperature: "Temperatura (°C):",
            humidity: "Umidade (%):",
            calculate: "Calcular",
            clear: "Limpar",
            darkMode: "Modo Escuro",
            wbgtLabel: "WBGT: {wbgt}°C",
            safe: "Quase seguro",
            caution: "Atenção",
            warning: "Alerta",
            severe: "Alerta severo",
            danger: "Perigo"
        },
        "ja": {
            title: "WBGTチェッカー（手動）",
            temperature: "気温 (°C):",
            humidity: "湿度 (%):",
            calculate: "計算",
            clear: "クリア",
            darkMode: "ダークモード",
            wbgtLabel: "WBGT値: {wbgt}°C",
            safe: "ほぼ安全",
            caution: "注意",
            warning: "警戒",
            severe: "厳重警戒",
            danger: "危険"
        },
        "en": {
            title: "WBGT Checker (Manual)",
            temperature: "Temperature (°C):",
            humidity: "Humidity (%):",
            calculate: "Calculate",
            clear: "Clear",
            darkMode: "Dark Mode",
            wbgtLabel: "WBGT: {wbgt}°C",
            safe: "Almost Safe",
            caution: "Caution",
            warning: "Warning",
            severe: "Severe Alert",
            danger: "Danger"
        },
        "id": {
            title: "Pemeriksa WBGT (Manual)",
            temperature: "Suhu (°C):",
            humidity: "Kelembapan (%):",
            calculate: "Hitung",
            clear: "Bersihkan",
            darkMode: "Mode Gelap",
            wbgtLabel: "WBGT: {wbgt}°C",
            safe: "Hampir Aman",
            caution: "Waspada",
            warning: "Peringatan",
            severe: "Peringatan Serius",
            danger: "Bahaya"
        }
    };

    const tempInput = document.getElementById("temperature");
    const humInput = document.getElementById("humidity");
    const resultBox = document.getElementById("result");
    const langSelect = document.getElementById("language");
    const calcBtn = document.getElementById("calculate");
    const clearBtn = document.getElementById("clear");
    const toggle = document.getElementById("toggle-dark");

    function getWBGT(temp, humidity) {
        const table = {
            "30": { "60": 28 },
            "40": { "30": 31 }
        };
        const t = String(temp), h = String(humidity);
        return table[t]?.[h] ?? 27;
    }

    function getLevel(wbgt) {
        if (wbgt < 21) return { label: "safe", color: "#538DD5", textColor: "#FFFFFF" };
        if (wbgt <= 24) return { label: "caution", color: "#C5D9F1", textColor: "#000000" };
        if (wbgt <= 27) return { label: "warning", color: "#FFFF00", textColor: "#000000" };
        if (wbgt <= 30) return { label: "severe", color: "#FFC000", textColor: "#000000" };
        return { label: "danger", color: "#FF0000", textColor: "#FFFFFF" };
    }

    function updateResult(wbgt, lang) {
        const level = getLevel(wbgt);
        const t = translations[lang];
        resultBox.innerHTML = `<strong>${t.wbgtLabel.replace("{wbgt}", wbgt)}</strong><br><strong>${t[level.label]}</strong>`;
        resultBox.style.backgroundColor = level.color;
        resultBox.style.color = level.textColor;
        resultBox.style.borderRadius = "10px";
        resultBox.style.padding = "15px";
        resultBox.style.marginTop = "15px";
        resultBox.style.display = "block";
    }

    function clearForm() {
        tempInput.value = "";
        humInput.value = "";
        resultBox.innerHTML = "";
        resultBox.style.display = "none";
    }

    function applyTranslations(lang) {
        const t = translations[lang];
        document.getElementById("title").innerText = t.title;
        document.querySelector("label[for='temperature']").innerText = t.temperature;
        document.querySelector("label[for='humidity']").innerText = t.humidity;
        document.getElementById("calculate").innerText = t.calculate;
        document.getElementById("clear").innerText = t.clear;
        document.querySelector("label[for='toggle-dark']").innerText = t.darkMode;
    }

    calcBtn.addEventListener("click", () => {
        const temp = parseInt(tempInput.value);
        const hum = parseInt(humInput.value);
        if (!isNaN(temp) && !isNaN(hum)) {
            const wbgt = getWBGT(temp, hum);
            updateResult(wbgt, langSelect.value);
        }
    });

    clearBtn.addEventListener("click", clearForm);
    langSelect.addEventListener("change", () => {
        applyTranslations(langSelect.value);
    });

    toggle.addEventListener("change", () => {
        document.body.classList.toggle("dark-mode", toggle.checked);
    });

    applyTranslations("pt");
    clearForm();
});
