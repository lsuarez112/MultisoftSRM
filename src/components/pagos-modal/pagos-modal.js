export function setupComponent() {
    if (!Alpine.store('pagosModal')) {
        Alpine.store('pagosModal', {
            isOpen: false,
            pagosData: null,
            open(pago) { this.pagosData = pago; this.isOpen = true; },
            close() { this.pagosData = null; this.isOpen = false; }
        });
    }
}

export function initComponent() {
    // Verifica que Alpine ya esté disponible
    if (typeof Alpine?.store !== 'function') {
        console.warn('⚠️ Alpine aún no está listo. Asegurate de cargarlo antes.');
        return;
    }

    const el = document.getElementById('pagos-modal');
    if (el) Alpine.initTree(el);
}
