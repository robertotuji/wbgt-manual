
const wbgtTable = {
    "40": {"55": 35, "60": 36},
    "39": {"55": 34, "60": 35},
    "38": {"55": 33, "60": 34}
};

const translations = {
    "ja": {
        title: "WBGTチェッカー（手動）",
        labelTemp: "気温 (℃):",
        labelHumidity: "湿度 (%):",
        calculateBtn: "計算",
        clearBtn: "クリア",
        themeLabel: "ダークモード",
        resultText: "WBGT値: "
    },
    "pt": {
        title: "Verificador WBGT (Manual)",
        labelTemp: "Temperatura (℃):",
        labelHumidity: "Umidade (%):",
        calculateBtn: "Calcular",
        clearBtn: "Limpar",
        themeLabel: "Modo Escuro",
        resultText: "Valor WBGT: "
    },
    "en": {
        title: "WBGT Checker (Manual)",
        labelTemp: "Temperature (℃):",
        labelHumidity: "Humidity (%):",
        calculateBtn: "Calculate",
        clearBtn: "Clear",
        themeLabel: "Dark Mode",
        resultText: "WBGT Value: "
    }
};

function calculateWBGT() {
    const temp = document.getElementById("temperature").value;
    const humidity = document.getElementById("humidity").value;
    const result = document.getElementById("result");

    if (wbgtTable[temp] && wbgtTable[temp][humidity]) {
        result.textContent = translations[lang].resultText + wbgtTable[temp][humidity];
    } else {
        result.textContent = translations[lang].resultText + "N/A";
    }
}

function clearFields() {
    document.getElementById("temperature").value = "";
    document.getElementById("humidity").value = "";
    document.getElementById("result").textContent = "";
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}

let lang = "ja";
function changeLanguage() {
    lang = document.getElementById("language-select").value;
    document.getElementById("title").textContent = translations[lang].title;
    document.getElementById("label-temp").textContent = translations[lang].labelTemp;
    document.getElementById("label-humidity").textContent = translations[lang].labelHumidity;
    document.getElementById("calculate-btn").textContent = translations[lang].calculateBtn;
    document.getElementById("clear-btn").textContent = translations[lang].clearBtn;
    document.getElementById("theme-label").textContent = translations[lang].themeLabel;
}
