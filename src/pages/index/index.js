// @ts-nocheck

/**
 * index.js
 * Página principal: inicialización y renderizado de tablas principales.
 * 
 * Funciones:
 * - initIndex: Inicializa la página y carga los datos principales.
 * - renderOrdenesDeCompra: Renderiza la tabla de órdenes de compra.
 * - renderFacturas: Renderiza la tabla de facturas.
 * - renderResumenDeCuenta: Renderiza la tabla de resumen de cuenta.
 * - renderPagos: Renderiza la tabla de pagos.
 * - formatearFecha: Formatea fechas ISO a dd/mm/yyyy.
 */

/**
 * Inicializa la página principal, mostrando loaders y luego los datos.
 */
export async function initIndex() {
  console.log('[SRM] 🔄 Iniciando página principal...');

  // Simula un delay para mostrar loaders (1.5s)
  await new Promise(resolve => setTimeout(resolve, 1500));

  renderOrdenesDeCompra();
  renderFacturas();
  renderResumenDeCuenta();
  renderPagos();

  console.log('[SRM] ✅ Página principal cargada.');
}

/**
 * Renderiza la tabla de Órdenes de Compra.
 */
async function renderOrdenesDeCompra() {
  console.log('[SRM] 📦 Cargando Órdenes de Compra...');

  const tablaBody = document.getElementById('ordenes_de_compra_table_content');
  if (!tablaBody) {
    console.warn('[SRM] ⚠️ No se encontró el contenedor de Órdenes de Compra.');
    return;
  }

  try {
    // Limpia contenido anterior (por si hay loaders o duplicados)
    tablaBody.innerHTML = '';

    const [ordenes, rowTemplateHtml] = await Promise.all([
      fetch('ordenes_de_compra.json').then(r => r.json()),
      fetch('src/components/oc-row/oc-row.html').then(r => r.text())
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

    Alpine.initTree(tablaBody);

    // Importa y expone funciones de eventos para las filas de OC
    const { initOcRowEvents, uploadPDF, handleFileChange } = await import('/src/components/oc-row/oc-row.js');
    window.uploadPDF = uploadPDF;
    window.handleFileChange = handleFileChange;
    initOcRowEvents();

    console.log('[SRM] ✅ Órdenes de Compra cargadas.');
  } catch (err) {
    console.error('[SRM] ❌ Error al renderizar Órdenes de Compra:', err);
  }
}

/**
 * Renderiza la tabla de Facturas.
 */
async function renderFacturas() {
  console.log('[SRM] 📄 Cargando Facturas...');

  const tablaBody = document.getElementById('facturas_table_content');
  if (!tablaBody) {
    console.warn('[SRM] ⚠️ No se encontró el contenedor de Facturas.');
    return;
  }

  try {
    // Limpia contenido anterior (por si hay loaders o duplicados)
    tablaBody.innerHTML = '';

    const [facturas, rowTemplateHtml] = await Promise.all([
      fetch('facturas.json').then(r => r.json()),
      fetch('src/components/fact-row/fact-row.html').then(r => r.text())
    ]);

    facturas.forEach(fact => {
      const rowHtml = rowTemplateHtml
        .replace(/{{fecha_carga}}/g, formatearFecha(fact.fecha_carga))
        .replace(/{{fecha_emision}}/g, formatearFecha(fact.fecha_emision))
        .replace(/{{fecha_vencimiento}}/g, formatearFecha(fact.fecha_vencimiento))
        .replace(/{{numero_fact}}/g, fact.numero_fact)
        .replace(/{{importe}}/g, fact.importe)
        .replace(/{{estado}}/g, fact.estado)
        .replace(/{{observacion}}/g, fact.observacion)
        .replace(/{{condicion_compra}}/g, fact.condicion_compra)
        .replace(/{{centro_costo}}/g, fact.centro_costo);

      tablaBody.insertAdjacentHTML('beforeend', rowHtml);
    });

    console.log('[SRM] ✅ Facturas cargadas.');
  } catch (err) {
    console.error('[SRM] ❌ Error al renderizar Facturas:', err);
  }
}

/**
 * Renderiza la tabla de Resumen de Cuenta.
 */
async function renderResumenDeCuenta() {
  console.log('[SRM] 📊 Cargando Resumen de Cuenta...');

  const tablaBody = document.getElementById('resumen_cuenta_table_content');
  if (!tablaBody) {
    console.warn('[SRM] ⚠️ No se encontró el contenedor de Resumen de Cuenta.');
    return;
  }

  try {
    // Limpia contenido anterior (por si hay loaders o duplicados)
    tablaBody.innerHTML = '';

    const [resumen, rowTemplateHtml] = await Promise.all([
      fetch('resumen.json').then(r => r.json()),
      fetch('src/components/resumen-row/resumen-row.html').then(r => r.text())
    ]);

    /**
     * Calcula los saldos acumulados para cada movimiento.
     * @param {Array} data 
     * @returns {Array}
     */
    function calcularSaldos(data) {
      let saldoAcumulado = 0;
      return data.map(mov => {
        saldoAcumulado += mov.debe - mov.haber;
        return {
          ...mov,
          saldo: saldoAcumulado
        };
      });
    }

    const $totalDeuda = $('#total-deuda');
    const dataConSaldo = calcularSaldos(resumen);

    // Generar filas
    dataConSaldo.forEach(mov => {
      const debeStr = mov.debe > 0
        ? '$' + mov.debe.toLocaleString('es-AR', { minimumFractionDigits: 2 })
        : '';
      const haberStr = mov.haber > 0
        ? '$' + mov.haber.toLocaleString('es-AR', { minimumFractionDigits: 2 })
        : '';

      const saldoStr = mov.saldo.toLocaleString('es-AR', { minimumFractionDigits: 2 });

      let row = rowTemplateHtml
        .replace('{{fecha}}', formatearFecha(mov.fecha))
        .replace('{{numero_doc}}', mov.numero_doc)
        .replace('{{tipo}}', mov.tipo)
        .replace('{{debe}}', debeStr)
        .replace('{{haber}}', haberStr)
        .replace('{{saldo}}', '$' + saldoStr);

      tablaBody.insertAdjacentHTML('beforeend', row);
    });

    const total = dataConSaldo[dataConSaldo.length - 1]?.saldo ?? 0;
    $totalDeuda.html(`$${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`);

    console.log('[SRM] ✅ Resumen de Cuenta cargado.');
  } catch (err) {
    console.error('[SRM] ❌ Error al renderizar Resumen de Cuenta:', err);
  }
}

/**
 * Renderiza la tabla de Pagos.
 */
async function renderPagos() {
  console.log('[SRM] 💸 Cargando Pagos...');

  const tablaBody = document.getElementById('pagos_table_content');
  if (!tablaBody) {
    console.warn('[SRM] ⚠️ No se encontró el contenedor de Pagos.');
    return;
  }

  try {
    // Limpia contenido anterior (por si hay loaders o duplicados)
    tablaBody.innerHTML = '';

    const [pagos, rowTemplateHtml] = await Promise.all([
      fetch('pagos.json').then(r => r.json()),
      fetch('src/components/pagos-row/pagos-row.html').then(r => r.text())
    ]);

    // Generar filas
    pagos.forEach(pago => {
      let row = rowTemplateHtml
        .replace('{{fecha_pago}}', formatearFecha(pago.fecha))
        .replace('{{fecha_vencimiento}}', formatearFecha(pago.fecha_vencimiento))
        .replace('{{monto}}', pago.monto)
        .replace('{{medio_de_pago}}', pago.medio_de_pago)
        .replace('{{estado}}', pago.estado)
        .replace('{{numero_pago}}', pago.numero_pago);

      tablaBody.insertAdjacentHTML('beforeend', row);
    });

    // Importa y expone funciones de eventos para las filas de Pagos
    const { initPagoRowEvents} = await import('/src/components/pagos-row/pagos-row.js');
    initPagoRowEvents();

  } catch (err) {
    console.error('[SRM] ❌ Error al renderizar Pagos:', err);
  }
}

/**
 * Formatea una fecha ISO (yyyy-mm-dd) a formato dd/mm/yyyy.
 * @param {string} fechaIso 
 * @returns {string}
 */
function formatearFecha(fechaIso) {
  const [y, m, d] = fechaIso.split('-');
  return `${d}/${m}/${y}`;
}



