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

// NOVA VARIÁVEL PARA ARMAZENAR OS DADOS WBGT
let wbgtData = {};

// FUNÇÃO PARA CARREGAR OS DADOS WBGT DO JSON
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

// Chamar a função para carregar os dados assim que o script for executado
loadWbgtData();

// FUNÇÃO ATUALIZADA para calcular o WBGT usando a tabela JSON
function calculateWBGT(temp, hum) {
    if (Object.keys(wbgtData).length === 0) {
        console.error("Dados WBGT não carregados.");
        return { wbgt: null, levelIdx: -1, color: "#CCCCCC" }; // Retorna valores de erro
    }

    // Arredonda a temperatura e umidade para o inteiro mais próximo.
    // Isso é importante porque as chaves do JSON são inteiros.
    const roundedTemp = Math.round(temp);
    const roundedHum = Math.round(hum);

    // Converte para string para corresponder às chaves do JSON (que são strings)
    const tempKey = String(roundedTemp);
    const humKey = String(roundedHum);

    let wbgtValue = null;

    // Tenta encontrar o valor exato na tabela.
    // Verifica se a temperatura existe na tabela e se a umidade existe para essa temperatura.
    if (wbgtData[tempKey] && wbgtData[tempKey][humKey]) {
        wbgtValue = wbgtData[tempKey][humKey];
    } else {
        // Se o valor exato não for encontrado, tenta encontrar o valor mais próximo na tabela.
        // Isso é uma simplificação. Para maior precisão, pode-se usar interpolação.

        // Pega as temperaturas disponíveis na tabela e ordena.
        const availableTemps = Object.keys(wbgtData).map(Number).sort((a, b) => a - b);
        // Encontra a temperatura na tabela que está mais próxima da temperatura inserida pelo usuário.
        let closestTemp = availableTemps.reduce((prev, curr) => (
            Math.abs(curr - temp) < Math.abs(prev - temp) ? curr : prev
        ));
        // Garante que a temperatura mais próxima esteja dentro dos limites da tabela (21 a 40).
        closestTemp = Math.min(Math.max(closestTemp, 21), 40);

        // Se a temperatura mais próxima for válida, procura pela umidade mais próxima.
        if (wbgtData[String(closestTemp)]) { // Use String(closestTemp) para acessar a chave do objeto
            const availableHums = Object.keys(wbgtData[String(closestTemp)]).map(Number).sort((a, b) => a - b);
            // Encontra a umidade na tabela que está mais próxima da umidade inserida pelo usuário.
            let closestHum = availableHums.reduce((prev, curr) => (
                Math.abs(curr - hum) < Math.abs(prev - hum) ? curr : prev
            ));
            // Garante que a umidade mais próxima esteja dentro dos limites da tabela (20 a 100).
            closestHum = Math.min(Math.max(closestHum, 20), 100);

            // Obtém o valor WBGT usando a temperatura e umidade mais próximas encontradas.
            wbgtValue = wbgtData[String(closestTemp)][String(closestHum)];
            console.warn(`WBGT: Usando valores aproximados - Temp: ${closestTemp}°C, Hum: ${closestHum}% para Temp: ${temp}°C, Hum: ${hum}%`);
        }
    }

    // Se ainda assim o WBGT não for encontrado (ex: valores fora da faixa da tabela),
    // retorna um valor padrão ou de erro.
    if (wbgtValue === null) {
        console.error("WBGT não encontrado para os valores fornecidos ou aproximados na tabela.");
        return { wbgt: null, levelIdx: -1, color: "#CCCCCC" }; // Cor cinza para erro
    }

    // Agora, determine o NÍVEL DE RISCO e a COR com base no VALOR WBGT encontrado na tabela.
    // Estes são limites de WBGT (você pode ajustá-los se tiver uma referência específica para cada nível).
    let levelIdx;
    let color;

    if (wbgtValue < 25) {
        levelIdx = 0; // Quase Seguro
        color = "#538DD5"; // Azul claro
    } else if (wbgtValue >= 25 && wbgtValue < 28) {
        levelIdx = 1; // Atenção
        color = "#C5D9F1"; // Azul mais claro
    } else if (wbgtValue >= 28 && wbgtValue < 31) {
        levelIdx = 2; // Alerta
        color = "#FFFF00"; // Amarelo
    } else if (wbgtValue >= 31 && wbgtValue < 34) {
        levelIdx = 3; // Alerta Máximo
        color = "#FFC000"; // Laranja
    } else {
        levelIdx = 4; // Perigo
        color = "#FF0000"; // Vermelho
    }

    // Retorna o valor WBGT, o índice do nível e a cor.
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

// Event listener para mudança de idioma
document.getElementById("language").addEventListener("change", (e) => {
    updateLanguage(e.target.value);
});

// Event listener para o checkbox de modo escuro (melhor do que o botão 🌙)
document.getElementById("dark-mode").addEventListener("change", () => {
    document.body.classList.toggle("dark-mode");
});

// Remove o listener do botão 🌙, pois o checkbox fará a função
// document.getElementById("toggle-theme").addEventListener("click", () => {
//     document.body.classList.toggle("dark-mode");
// });


document.getElementById("calculate").addEventListener("click", () => {
    const temp = parseFloat(document.getElementById("temperature").value);
    const hum = parseFloat(document.getElementById("humidity").value);
    const lang = document.getElementById("language").value;

    if (isNaN(temp) || isNaN(hum)) {
        alert(translations[lang].invalidInput);
        return;
    }

    // Chama a função de cálculo e obtém o objeto com wbgt, levelIdx e color
    const { wbgt, levelIdx, color } = calculateWBGT(temp, hum);

    if (wbgt === null) {
        resultBox.classList.remove("hidden");
        resultBox.style.backgroundColor = "#CCCCCC"; // Cor cinza para erro
        result.innerHTML = `WBGT: N/A<br><strong>${translations[lang].invalidInput}</strong>`;
        return;
    }

    const label = translations[lang].levels[levelIdx];

    resultBox.classList.remove("hidden");
    resultBox.style.backgroundColor = color;
    // Exibe o valor WBGT REAL que foi encontrado na tabela
    result.innerHTML = `WBGT: ${wbgt}°C<br><strong>${label}</strong>`;
});

document.getElementById("clear").addEventListener("click", () => {
    document.getElementById("temperature").value = "";
    document.getElementById("humidity").value = "";
    resultBox.classList.add("hidden");
});

// Inicializa o idioma quando a página carrega
document.addEventListener("DOMContentLoaded", () => {
    updateLanguage(document.getElementById("language").value);
});