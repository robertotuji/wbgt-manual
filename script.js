const translations = {
    ja: {
        title: "WBGTチェッカー（手動）",
        temperature: "気温(°C) 乾球温度:",
        humidity: "湿度 (%):",
        calculate: "計算",
        clear: "クリア",
        dark: "ダークモード",
        invalidInput: "有効な温度と湿度を入力してください。",
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

function calculateWBGT(temp, hum) {
    if (Object.keys(wbgtData).length === 0) {
        console.error("Dados WBGT não carregados.");
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

            wbgtValue = wbgtData[String(closestTemp)][String(closestHum)];
            console.warn(`WBGT: Usando valores aproximados - Temp: ${closestTemp}°C, Hum: ${closestHum}% para Temp: ${temp}°C, Hum: ${hum}%`);
        }
    }

    if (wbgtValue === null) {
        console.error("WBGT não encontrado para os valores fornecidos ou aproximados na tabela.");
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
    else if (wbgtValue >= 28) { // Já sabemos que não é >= 31, então se for >= 28, será 28, 29 ou 30.
        levelIdx = 3; // Alerta Máximo
        color = "#FFC000";
    }
    // 25～27 WBGT → Alerta (#FFFF00)
    else if (wbgtValue >= 25) { // Já sabemos que não é >= 28, então se for >= 25, será 25, 26 ou 27.
        levelIdx = 2; // Alerta
        color = "#FFFF00";
    }
    // 21～24 WBGT → Atenção (#C5D9F1)
    else if (wbgtValue >= 21) { // Já sabemos que não é >= 25, então se for >= 21, será 21, 22, 23 ou 24.
        levelIdx = 1; // Atenção
        color = "#C5D9F1";
    }
    // Abaixo de 21 WBGT → Quase Seguro (#538DD5)
    else { // Se nenhuma das condições acima for verdadeira, significa que wbgtValue é menor que 21.
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
}

document.getElementById("language").addEventListener("change", (e) => {
    updateLanguage(e.target.value);
});

document.getElementById("dark-mode").addEventListener("change", () => {
    document.body.classList.toggle("dark-mode");
});

document.getElementById("calculate").addEventListener("click", () => {
    const temp = parseFloat(document.getElementById("temperature").value);
    const hum = parseFloat(document.getElementById("humidity").value);
    const lang = document.getElementById("language").value;

    if (isNaN(temp) || isNaN(hum)) {
        alert(translations[lang].invalidInput);
        return;
    }

    const { wbgt, levelIdx, color } = calculateWBGT(temp, hum);

    if (wbgt === null) {
        resultBox.classList.remove("hidden");
        resultBox.style.backgroundColor = "#CCCCCC";
        result.innerHTML = `WBGT: N/A<br><strong>${translations[lang].invalidInput}</strong>`;
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
});

document.addEventListener("DOMContentLoaded", () => {
    updateLanguage(document.getElementById("language").value);
});
