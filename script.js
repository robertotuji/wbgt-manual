const translations = {
    ja: {
        title: "WBGTチェッカー（手動）",
        temperature: "気温(°C) 乾球温度:",
        humidity: "湿度 (%):",
        calculate: "計算",
        clear: "クリア",
        dark: "ダークモード",
        invalidInput: "有効な温度と湿度を入力してください。",
        tempOutOfRange: "温度は21°Cから40°Cの間である必要があります。この範囲外にはWBGTテーブルに値が記録されていません。",
        humOutOfRange: "相対湿度は20%から100%の間で、5刻みである必要があります。この範囲外にはWBGTテーブルに値が記録されていません。",
        levels: [
            "ほぼ安全",
            "注意",
            "警戒",
            "厳重警戒",
            "危険"
        ]
    },
    pt: {
        title: "Verificador WBGT (Manual)",
        temperature: "Temperatura (°C) Temperatura de Bulbo Seco:",
        humidity: "Umidade (%):",
        calculate: "Calcular",
        clear: "Limpar",
        dark: "Modo Escuro",
        invalidInput: "Por favor, insira valores válidos para Temperatura e Umidade.",
        tempOutOfRange: "A temperatura deve estar entre 21°C e 40°C, pois fora desses limites não há valores registrados na tabela WBGT.",
        humOutOfRange: "A umidade relativa deve estar entre 20% e 100%, com intervalos de 5 em 5, pois fora desses limites não há valores registrados na tabela WBGT.",
        levels: [
            "Quase Seguro",
            "Atenção",
            "Alerta",
            "Alerta Máximo",
            "Perigo"
        ]
    },
    en: {
        title: "WBGT Checker (Manual)",
        temperature: "Temperature (°C)Dry Bulb Temperature:",
        humidity: "Humidity (%):",
        calculate: "Calculate",
        clear: "Clear",
        dark: "Dark Mode",
        invalidInput: "Please enter valid Temperature and Humidity values.",
        tempOutOfRange: "Temperature must be between 21°C and 40°C, as there are no recorded values outside these limits in the WBGT table.",
        humOutOfRange: "Relative humidity must be between 20% and 100%, with intervals of 5, as there are no recorded values outside these limits in the WBGT table.",
        levels: [
            "Almost Safe",
            "Caution",
            "Warning",
            "High Alert",
            "Danger"
        ]
    },
    id: {
        title: "Pemeriksa WBGT (Manual)",
        temperature: "Suhu (°C) Suhu Bola Kering:",
        humidity: "Kelembaban (%):",
        calculate: "Hitung",
        clear: "Bersihkan",
        dark: "Mode Gelap",
        invalidInput: "Mohon masukkan nilai Suhu dan Kelembaban yang valid.",
        tempOutOfRange: "Suhu harus antara 21°C dan 40°C, karena tidak ada nilai yang tercatat di luar batas ini dalam tabel WBGT.",
        humOutOfRange: "Kelembaban relatif harus antara 20% dan 100%, dengan interval 5, karena tidak ada nilai yang tercatat di luar batas ini dalam tabel WBGT.",
        levels: [
            "Hampir Aman",
            "Waspada",
            "Siaga",
            "Siaga Tinggi",
            "Bahaya"
        ]
    }
};

const resultBox = document.getElementById("result-box");
const result = document.getElementById("result");
const errorMessageBox = document.getElementById("error-message-box"); // NOVO: Elemento para caixa de erro
const errorMessage = document.getElementById("error-message"); // NOVO: Elemento para texto de erro

let wbgtData = {};

async function loadWbgtData() {
    try {
        const response = await fetch('wbgt_table_preciso.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        wbgtData = await response.json();
        console.log("Dados WBGT carregados com sucesso!");
    } catch (error) {
        console.error("Erro ao carregar os dados WBGT:", error);
        alert("Erro ao carregar a tabela de WBGT. Por favor, tente novamente mais tarde.");
    }
}

loadWbgtData();

// NOVA FUNÇÃO para exibir mensagens de erro personalizadas
function displayError(message) {
    resultBox.classList.add("hidden"); // Esconde a caixa de resultado se houver erro
    errorMessageBox.classList.remove("hidden");
    errorMessage.innerHTML = message;
}

// NOVA FUNÇÃO para esconder mensagens de erro
function hideError() {
    errorMessageBox.classList.add("hidden");
    errorMessage.innerHTML = "";
}


function calculateWBGT(temp, hum) {
    if (Object.keys(wbgtData).length === 0) {
        displayError(translations[document.getElementById("language").value].invalidInput); // Usa a nova função
        return { wbgt: null, levelIdx: -1, color: "#CCCCCC" };
    }

    // VALIDAÇÃO DE LIMITES DE ENTRADA
    if (temp < 21 || temp > 40) {
        displayError(translations[document.getElementById("language").value].tempOutOfRange); // Usa a nova função
        return { wbgt: null, levelIdx: -1, color: "#CCCCCC" };
    }
    // Verifica também o intervalo de 5 em 5 para umidade
    if (hum < 20 || hum > 100 || hum % 5 !== 0) {
        displayError(translations[document.getElementById("language").value].humOutOfRange); // Usa a nova função
        return { wbgt: null, levelIdx: -1, color: "#CCCCCC" };
    }

    const roundedTemp = Math.round(temp);
    const roundedHum = Math.round(hum);

    const tempKey = String(roundedTemp);
    const humKey = String(roundedHum);

    let wbgtValue = null;

    if (wbgtData[tempKey] && wbgtData[tempKey][humKey]) {
        wbgtValue = wbgtData[tempKey][humKey];
    } else {
        const availableTemps = Object.keys(wbgtData).map(Number).sort((a, b) => a - b);
        let closestTemp = availableTemps.reduce((prev, curr) => (
            Math.abs(curr - temp) < Math.abs(prev - temp) ? curr : prev
        ));
        closestTemp = Math.min(Math.max(closestTemp, 21), 40);

        if (wbgtData[String(closestTemp)]) {
            const availableHums = Object.keys(wbgtData[String(closestTemp)]).map(Number).sort((a, b) => a - b);
            let closestHum = availableHums.reduce((prev, curr) => (
                Math.abs(curr - hum) < Math.abs(prev - hum) ? curr : prev
            ));
            closestHum = Math.min(Math.max(closestHum, 20), 100);

            // Garante que o closestHum seja um múltiplo de 5, já que a tabela só tem de 5 em 5.
            closestHum = Math.round(closestHum / 5) * 5;
            closestHum = Math.min(Math.max(closestHum, 20), 100); // Re-limita após arredondamento

            if (wbgtData[String(closestTemp)][String(closestHum)]) {
                 wbgtValue = wbgtData[String(closestTemp)][String(closestHum)];
                 console.warn(`WBGT: Usando valores aproximados - Temp: ${closestTemp}°C, Hum: ${closestHum}% para Temp: ${temp}°C, Hum: ${hum}%`);
            } else {
                 console.error(`Não foi possível encontrar WBGT para temp ${temp} e hum ${hum} mesmo com aproximação.`);
                 displayError(translations[document.getElementById("language").value].invalidInput);
                 return { wbgt: null, levelIdx: -1, color: "#CCCCCC" };
            }
        }
    }

    if (wbgtValue === null) {
        displayError(translations[document.getElementById("language").value].invalidInput);
        return { wbgt: null, levelIdx: -1, color: "#CCCCCC" };
    }

    let levelIdx;
    let color;

    // DEFINIÇÃO FINAL DAS FAIXAS DE WBGT, TESTADAS PARA COBRIR TODOS OS CASOS.
    // A ordem é do maior para o menor para garantir que as condições mais "altas" sejam verificadas primeiro.

    // 31 WBGT e acima → Perigo (#FF0000)
    if (wbgtValue >= 31) {
        levelIdx = 4; // Perigo
        color = "#FF0000";
    }
    // 28～30 WBGT → Alerta Máximo (#FFC000)
    else if (wbgtValue >= 28) {
        levelIdx = 3; // Alerta Máximo
        color = "#FFC000";
    }
    // 25～27 WBGT → Alerta (#FFFF00)
    else if (wbgtValue >= 25) {
        levelIdx = 2; // Alerta
        color = "#FFFF00";
    }
    // 21～24 WBGT → Atenção (#C5D9F1)
    else if (wbgtValue >= 21) {
        levelIdx = 1; // Atenção
        color = "#C5D9F1";
    }
    // Abaixo de 21 WBGT → Quase Seguro (#538DD5)
    else {
        levelIdx = 0; // Quase Seguro
        color = "#538DD5";
    }

    return { wbgt: wbgtValue, levelIdx: levelIdx, color: color };
}

function updateLanguage(lang) {
    const t = translations[lang];
    document.getElementById("title").textContent = t.title;
    document.getElementById("label-temp").textContent = t.temperature;
    document.getElementById("label-humidity").textContent = t.humidity;
    document.getElementById("calculate").textContent = t.calculate;
    document.getElementById("clear").textContent = t.clear;
    document.getElementById("dark-label").textContent = t.dark;
    hideError(); // Esconde qualquer erro ao mudar o idioma
}

document.getElementById("language").addEventListener("change", (e) => {
    updateLanguage(e.target.value);
});

document.getElementById("dark-mode").addEventListener("change", () => {
    document.body.classList.toggle("dark-mode");
});

document.getElementById("calculate").addEventListener("click", () => {
    hideError(); // Esconde erros anteriores ao tentar calcular
    const temp = parseFloat(document.getElementById("temperature").value);
    const hum = parseFloat(document.getElementById("humidity").value);
    const lang = document.getElementById("language").value;

    if (isNaN(temp) || isNaN(hum)) {
        displayError(translations[lang].invalidInput);
        return;
    }

    const { wbgt, levelIdx, color } = calculateWBGT(temp, hum);

    if (wbgt === null) {
        // A função calculateWBGT já chamará displayError se wbgt for null
        resultBox.classList.add("hidden"); // Garante que a caixa de resultado esteja oculta
        return;
    }

    const label = translations[lang].levels[levelIdx];

    resultBox.classList.remove("hidden");
    resultBox.style.backgroundColor = color;
    result.innerHTML = `WBGT: ${wbgt}°C<br><strong>${label}</strong>`;
});

document.getElementById("clear").addEventListener("click", () => {
    document.getElementById("temperature").value = "";
    document.getElementById("humidity").value = "";
    resultBox.classList.add("hidden");
    hideError(); // NOVO: Esconde a caixa de erro ao limpar
});

document.addEventListener("DOMContentLoaded", () => {
    updateLanguage(document.getElementById("language").value);
});
