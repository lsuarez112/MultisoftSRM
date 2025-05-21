/**
 * index.js
 * 
 */
export async function initIndex() {
    console.log('JFT - 🔐 initIndex cargado');

    await renderOrdenesDeCompra();
    // Luego: await renderFacturasCargadas(); etc.
}

async function renderOrdenesDeCompra() {
  console.log('📦 Cargando tabla de Órdenes de Compra...');

  const tablaBody = document.getElementById('ordenes_de_compra_table_content');
  if (!tablaBody) return;

  try {
    // Simula un delay para que se vean los loaders (2500ms)
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Limpia contenido anterior (por si hay loaders o duplicados)
    tablaBody.innerHTML = '';

    const [ordenes, rowTemplateHtml] = await Promise.all([
      fetch('/src/pages/index/ordenes_de_compra.json').then(r => r.json()),
      fetch('/src/components/oc-row/oc-row.html').then(r => r.text())
    ]);

    ordenes.forEach(oc => {
      const rowHtml = rowTemplateHtml
        .replace(/{{numero_oc}}/g, oc.numero_oc)
        .replace(/{{fecha}}/g, formatearFecha(oc.fecha))
        .replace(/{{importe}}/g, oc.importe.toLocaleString('es-AR', { minimumFractionDigits: 2 }))
        .replace(/{{label_disabled}}/g, oc.pdf_adjunto ? 'opacity-50 pointer-events-none' : '')
        .replace(/{{input_disabled}}/g, oc.pdf_adjunto ? 'disabled' : '')
        .replace(/{{button_disabled}}/g, oc.pdf_adjunto ? 'disabled class="text-gray-400 cursor-not-allowed text-xs"' : '')
        .replace(/{{file_label}}/g, oc.pdf_adjunto ? 'PDF cargado' : 'Sin archivo')
        .replace(/{{file_title}}/g, oc.pdf_adjunto ? oc.pdf_path : 'Sin archivo');

      tablaBody.insertAdjacentHTML('beforeend', rowHtml);
    });

  } catch (err) {
    console.error('❌ Error al renderizar Órdenes de Compra:', err);
  }
}

function formatearFecha(fechaIso) {
  const [y, m, d] = fechaIso.split('-');
  return `${d}/${m}/${y}`;
}



