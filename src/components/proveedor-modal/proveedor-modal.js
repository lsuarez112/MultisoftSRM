export function setupComponent() {
    if (!Alpine.store('proveedorModal')) {
        Alpine.store('proveedorModal', {
            isOpen: false,
            proveedorData: [],
            proveedorSeleccionado: null,

            open(data) {
                this.proveedorData = data;
                this.proveedorSeleccionado = data?.[3]?.codigo || null; // hardcodear el 4to seleccionado
                this.isOpen = true;
            },

            close() {
                this.isOpen = false;
                // proveedorData y proveedorSeleccionado permanecen disponibles
            }
        });

    }
}

export function initComponent() {
    // Verifica que Alpine ya esté disponible
    if (typeof Alpine?.store !== 'function') {
        console.warn('⚠️ Alpine aún no está listo. Asegurate de cargarlo antes.');
        return;
    }

    const el = document.getElementById('proveedor-modal');
    if (el) Alpine.initTree(el);

    //asignar acciones de buscador de modal para que cargue un listado de proveedores test cargados en proveedores.json

}

export function initHandleProveedor() {
    const botonesAbrirModalProveedor = document.querySelectorAll('button[data-proveedor]');

    botonesAbrirModalProveedor.forEach(btn => {

        $(btn).attr('disabled', false)

        btn.addEventListener('click', async e => {
            e.preventDefault();

            const codigoProveedor = $(btn).attr('data-proveedor')
            try {

                const response = await fetch('proveedores.json');
                const data = await response.json();

                Alpine.store('proveedorModal').open(data);
            } catch (err) {
                console.error(`❌ No se pudo cargar Modal de Proveedores con proveedor ${codigoProveedor}`, err);
            }
        });
    });


}
