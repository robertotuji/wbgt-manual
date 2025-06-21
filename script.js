
document.getElementById('calculate').addEventListener('click', function () {
    const temperature = parseFloat(document.getElementById('temperature').value);
    const humidity = parseInt(document.getElementById('humidity').value);
    const lang = document.getElementById('language').value;

    if (!temperature || !humidity) return;

    fetch('wbgt_table_preciso.json')
        .then(response => response.json())
        .then(data => {
            const tempKey = temperature.toString();
            const wbgt = data[tempKey] ? data[tempKey][humidity.toString()] : null;
            if (wbgt === undefined || wbgt === null) return;

            const resultBox = document.getElementById('result-box');
            const result = document.getElementById('result');

            let label = '';
            let bgColor = '';
            let textColor = '';

            if (wbgt < 21) {
                label = { 'jp': 'ほぼ安全', 'pt': 'Quase seguro', 'en': 'Mostly Safe', 'id': 'Hampir Aman' }[lang];
                bgColor = '#538DD5';
                textColor = 'white';
            } else if (wbgt >= 21 && wbgt <= 24) {
                label = { 'jp': '注意', 'pt': 'Atenção', 'en': 'Caution', 'id': 'Perhatian' }[lang];
                bgColor = '#C5D9F1';
                textColor = 'black';
            } else if (wbgt >= 25 && wbgt <= 27) {
                label = { 'jp': '警戒', 'pt': 'Alerta', 'en': 'Warning', 'id': 'Waspada' }[lang];
                bgColor = '#FFFF00';
                textColor = 'black';
            } else if (wbgt >= 28 && wbgt <= 30) {
                label = { 'jp': '厳重警戒', 'pt': 'Alerta severo', 'en': 'Severe Warning', 'id': 'Peringatan Berat' }[lang];
                bgColor = '#FFC000';
                textColor = 'black';
            } else if (wbgt >= 31) {
                label = { 'jp': '危険', 'pt': 'Perigo', 'en': 'Danger', 'id': 'Bahaya' }[lang];
                bgColor = '#FF0000';
                textColor = 'white';
            }

            resultBox.style.backgroundColor = bgColor;
            resultBox.style.borderRadius = '12px';
            result.style.color = textColor;
            result.innerHTML = `<strong>WBGT: ${wbgt}°C</strong><br><span>${label}</span>`;
            resultBox.style.display = 'block';
        });
});

document.getElementById('clear').addEventListener('click', function () {
    document.getElementById('temperature').value = '';
    document.getElementById('humidity').value = '';
    document.getElementById('result-box').style.display = 'none';
});
