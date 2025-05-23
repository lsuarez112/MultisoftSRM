/**
 * Formatea una fecha ISO (yyyy-mm-dd) a formato dd/mm/yyyy.
 * @param {string} fechaIso 
 * @returns {string}
 */
export function formatearFecha(fechaIso) {
    const [y, m, d] = fechaIso.split('-');
    return `${d}/${m}/${y}`;
}