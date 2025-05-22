// @ts-nocheck
// 📦 Modo test: guardamos el archivo en memoria por OC
const archivosPorOC = {};

/**
 * Trunca el nombre del archivo para mostrarlo
 */
function truncateName(name, maxLength = 30) {
    if (name.length <= maxLength) return name;
    const ext = name.substring(name.lastIndexOf('.'));
    return name.substring(0, maxLength - ext.length - 3) + '...' + ext;
}

/**
 * Maneja el cambio del input file por número de OC
 */
export function handleFileChange(numeroOC) {
    const input = document.getElementById(`pdfInput_${numeroOC}`);
    const fileInfo = document.getElementById(`fileInfo_${numeroOC}`);

    if (input.files.length > 0) {
        const archivo = input.files[0];
        archivosPorOC[numeroOC] = archivo;

        const nombreTruncado = truncateName(archivo.name);
        fileInfo.textContent = nombreTruncado;
        fileInfo.title = archivo.name;
    } else {
        archivosPorOC[numeroOC] = null;
        fileInfo.textContent = 'Sin archivo';
        fileInfo.title = 'Sin archivo';
    }
}

/**
 * Simula una subida de archivo y muestra resultado
 */
export function uploadPDF(numeroOC) {
    const archivo = archivosPorOC[numeroOC];
    const fileInfo = document.getElementById(`fileInfo_${numeroOC}`);

    if (!archivo) {
        fileInfo.textContent = '⚠️ Seleccioná un archivo';
        fileInfo.title = 'Ningún archivo seleccionado';
        return;
    }

    if (archivo.type !== 'application/pdf') {
        fileInfo.textContent = '❌ Solo PDF';
        fileInfo.title = archivo.name;
        return;
    }

    fileInfo.textContent = '⏳ Subiendo...';
    fileInfo.title = archivo.name;

    setTimeout(() => {
        fileInfo.textContent = '✅ OK (simulado)';
        fileInfo.title = archivo.name;
        console.log(`📁 OC ${numeroOC} subió: ${archivo.name}`);
    }, 1000);
}

/**
 * Inicializa eventos en las filas generadas: botón "Ver"
 */
export function initOcRowEvents() {
    const botonesVer = document.querySelectorAll('a[data-oc]');

    botonesVer.forEach(btn => {
        btn.addEventListener('click', async e => {
            e.preventDefault();
            const numeroOC = btn.dataset.oc;

            console.log('click en ver OC', numeroOC);

            try {
                const response = await fetch('/ordenes_de_compra.json');
                const data = await response.json();
                const oc = data.find(o => o.numero_oc === numeroOC);
                console.log('oc', oc);
                if (!oc) {
                    console.error(`❌ No se encontró OC ${numeroOC}`);
                    return;
                }
                alert(JSON.stringify(oc));
                // const modal = document.getElementById('oc-modal');
                // if (modal?.__x) {
                //     modal.__x.$data.ocData = oc;
                //     modal.__x.$data.isOpen = true;
                // }

            } catch (err) {
                console.error(`❌ No se pudo cargar OC ${numeroOC}`, err);
            }
        });
    });
}
