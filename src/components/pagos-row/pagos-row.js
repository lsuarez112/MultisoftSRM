import {formatearFecha} from '/MultisoftSRM/src/scripts/modules/tools.js'

export function initPagoRowEvents() {
    const botonesVer = document.querySelectorAll('#pagos_table_content a[data-pago]');

    botonesVer.forEach(btn => {
        btn.addEventListener('click', async e => {
            e.preventDefault();
            const numeroPago = btn.dataset.pago;

            try {
                const response = await fetch('pagos.json');
                const data = await response.json();
                const pago = data.find(thisPago => thisPago.numero_pago === numeroPago);
                if (!pago) {
                    console.error(`❌ No se encontró Pago ${numeroPago}`);
                    return;
                }

                // Armado de contenedor de datos de Pago

                pago.fecha = formatearFecha(pago.fecha)
                pago.fecha_vencimiento = formatearFecha(pago.fecha_vencimiento)
                pago.documentos = pago.documentos.map(item => ({
                    ...item,
                    fecha: formatearFecha(item.fecha)
                }));

                console.log('jft datapago', pago)

                // let dataPago = {

                //     documentos: pago.documentos
                // }

                Alpine.store('pagosModal').open(pago);
            } catch (err) {
                console.error(`❌ No se pudo cargar Pago ${numeroPago}`, err);
            }
        });
    });
}
