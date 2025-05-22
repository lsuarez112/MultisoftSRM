// @ts-nocheck

// import { Alpine } from 'alpinejs';

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
    // Simula un delay para que se vean los loaders (1500ms)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Limpia contenido anterior (por si hay loaders o duplicados)
    tablaBody.innerHTML = '';

    const [ordenes, rowTemplateHtml] = await Promise.all([
      fetch('/src/pages/index/ordenes_de_compra.json').then(r => r.json()),
      fetch('/src/components/oc-row/oc-row.html').then(r => r.text())
    ]);

    ordenes.forEach(oc => {

      const pdfNombre = oc.pdf_adjunto
        ? oc.pdf_path.split('/').pop()
        : 'Sin archivo';

      const pdfLabel = pdfNombre.length > 30
        ? pdfNombre.slice(0, 27) + '...'
        : pdfNombre;

      const rowHtml = rowTemplateHtml
        .replace(/{{numero_oc}}/g, oc.numero_oc)
        .replace(/{{fecha}}/g, formatearFecha(oc.fecha))
        .replace(/{{importe}}/g, oc.importe.toLocaleString('es-AR', { minimumFractionDigits: 2 }))
        .replace(/{{label_disabled}}/g, oc.pdf_adjunto ? 'opacity-50 pointer-events-none' : '')
        .replace(/{{input_disabled}}/g, oc.pdf_adjunto ? 'disabled' : '')
        .replace(/{{button_disabled}}/g, oc.pdf_adjunto ? 'disabled class="text-gray-400 cursor-not-allowed text-xs"' : '')
        .replace(/{{file_label}}/g, pdfLabel)
        .replace(/{{file_title}}/g, pdfNombre);

      tablaBody.insertAdjacentHTML('beforeend', rowHtml);
    });

    const { initOcRowEvents, uploadPDF, handleFileChange } = await import('/src/components/oc-row/oc-row.js');

    window.uploadPDF = uploadPDF;
    window.handleFileChange = handleFileChange;

    initOcRowEvents();

    // document.addEventListener('alpine:init', () => {
    //   Alpine.store('ocModal', {
    //     isOpen: false,
    //     ocData: null,
    //     open(oc) {
    //       this.ocData = oc;
    //       this.isOpen = true;
    //     },
    //     close() {
    //       this.isOpen = false;
    //       this.ocData = null;
    //     }
    //   });
    // });

  } catch (err) {
    console.error('❌ Error al renderizar Órdenes de Compra:', err);
  }
}

function formatearFecha(fechaIso) {
  const [y, m, d] = fechaIso.split('-');
  return `${d}/${m}/${y}`;
}



