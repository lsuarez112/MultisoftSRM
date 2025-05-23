export function setupComponent() {
    if (!Alpine.store('ocModal')) {
        Alpine.store('ocModal', {
            isOpen: false,
            ocData: null,
            open(oc) { this.ocData = oc; this.isOpen = true; },
            close() { this.ocData = null; this.isOpen = false; }
        });
    }
}

export function initComponent() {
    // Verifica que Alpine ya esté disponible
    if (typeof Alpine?.store !== 'function') {
        console.warn('⚠️ Alpine aún no está listo. Asegurate de cargarlo antes.');
        return;
    }

    const el = document.getElementById('oc-modal');
    if (el) Alpine.initTree(el);
}
