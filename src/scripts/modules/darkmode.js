/**
 * darkmode.js
 *
 * Inicializa el sistema de tema claro/oscuro para la aplicación.
 * Usa `localStorage` para persistir la preferencia del usuario.
 * Aplica la clase `dark` al elemento `<html>`, como requiere Tailwind CSS con `darkMode: 'class'`.
 *
 * Requiere un botón con `id="mode-toggle"` si se desea permitir el cambio manual.
 * Si no hay botón, se aplica automáticamente el modo preferido del sistema o el guardado en localStorage.
 *
 * Ejemplo de uso:
 *
 * HTML:
 * \<button id="mode-toggle">🌙</button>
 *
 * Tailwind config:
 * darkMode: 'class'
 *
 * En HTML:
 *  \<html class="dark"> se activa automáticamente si corresponde.
 */
export function setupDarkMode() {
  const toggleButton = document.getElementById('mode-toggle');
  const root = document.documentElement; // <html>

  /**
   * Obtiene el modo preferido por el usuario.
   * Si hay un valor guardado en localStorage, lo retorna.
   * Si no, detecta el modo preferido del sistema operativo.
   *
   * @returns {'dark' | 'light'}
   */
  function getPreferredMode() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
        return saved; // Retorna solo si es un valor válido
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
  }

  /**
   * Aplica el modo especificado (dark o light) al documento.
   * Guarda la preferencia en localStorage.
   *
   * @param {'dark' | 'light'} mode - El modo a aplicar.
   */
  function applyMode(mode) {
    root.classList.toggle('dark', mode === 'dark');
    localStorage.setItem('theme', mode);
    // Log para depuración: muestra el modo que se está aplicando (dark o light)
    console.warn(`Modo aplicado: ${mode}`);
  }

  // Si no hay botón, simplemente aplicar el modo preferido al cargar
  if (!toggleButton) {
    applyMode(getPreferredMode());
    return;
  }

  /**
   * Alterna entre modo claro y oscuro al hacer clic en el botón.
   */
  toggleButton.addEventListener('click', () => {
    const currentMode = root.classList.contains('dark') ? 'dark' : 'light';
    const newMode = currentMode === 'dark' ? 'light' : 'dark';
    applyMode(newMode);
  });

  // Aplicar modo al cargar
  applyMode(getPreferredMode());
}
