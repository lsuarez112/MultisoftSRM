/**
 * init.js
 *
 * Módulo principal de inicialización de la aplicación web.
 * Se encarga de aplicar el tema oscuro y ejecutar la lógica específica
 * según la página actual, detectada mediante el atributo `data-page` en el <body>.
 */

import { setupDarkMode } from '/src/scripts/modules/darkmode.js';

import { buildTemplates } from '/src/scripts/modules/template-engine.js';
import { initLogin } from '/src/pages/login/login.js';
import { initIndex } from '/src/pages/index/index.js';

$(async function () {
  // 1. Inicializa el modo oscuro (añade/remueve clase 'dark' en <html>)
  setupDarkMode();

  // 2. Cargar componentes HTML dinámicos
  await buildTemplates();

  /**
   * Router básico por atributo en <body data-page="">
   * Ejecuta el módulo correspondiente según la página actual.
   */
  const page = $(document.body).attr('data-page');

  // 3. Ejecuta Init de la página
  const routes = {
    login: initLogin,
    index: initIndex
  };

  if (routes[page]) {
    routes[page](); // Ejecuta la lógica de esa página
  }
});
