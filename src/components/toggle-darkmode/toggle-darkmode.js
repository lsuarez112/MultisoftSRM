/**
 * dark-toggle.js
 *
 * Componente: Botón para alternar entre modo oscuro y claro.
 *
 * Este módulo exporta una función `initComponent()` que será llamada automáticamente
 * por el sistema de plantillas (`buildTemplates`) cuando se incluya este componente
 * en el DOM usando `data-include="dark-toggle"`.
 *
 * Requisitos:
 * - El HTML debe contener un botón con `id="mode-toggle"`.
 * - La clase `dark` será añadida o quitada del elemento <html> según el modo actual.
 * - La preferencia se guarda en localStorage como "theme" ("dark" o "light").
 *
 * Dependencia visual:
 * - Tailwind debe estar configurado con `darkMode: 'class'`.
 */

export function setupComponent() {}

export function initComponent() {
  const toggleButton = document.getElementById('mode-toggle');
  const root = document.documentElement;

  if (!toggleButton) {
    console.warn('[dark-toggle] No se encontró #mode-toggle');
    return;
  }

  toggleButton.addEventListener('click', () => {
    const currentMode = root.classList.contains('dark') ? 'dark' : 'light';
    const newMode = currentMode === 'dark' ? 'light' : 'dark';

    root.classList.toggle('dark', newMode === 'dark');
    localStorage.setItem('theme', newMode);

    console.log(`[dark-toggle] Modo cambiado a ${newMode}`);
  });
}
