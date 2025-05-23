/**
 * 
 * template-engine.js
 *
 * Sistema de carga dinámica y recursiva de componentes HTML con JavaScript vanilla.
 *
 * Funcionalidad:
 * - Inserta HTML donde haya `data-include="[componente]"`.
 * - Carga y ejecuta el JS asociado si tiene un `setupComponent()` (antes del HTML) y `initComponent()` (después del HTML).
 * - No carga CSS (los estilos se incluyen en el output final de la página).
 */
export async function buildTemplates() {
  console.warn('🧩 Iniciando carga dinámica de componentes...');

  let templatesLoadedCount = 0;
  let foundNewIncludes = true;

  while (foundNewIncludes) {
    foundNewIncludes = false;

    const elements = Array.from(document.querySelectorAll('[data-include]'));
    if (elements.length === 0) break;

    await Promise.all(elements.map(async (el) => {
      const componentName = el.getAttribute('data-include');
      const basePath = `MultisoftSRM/src/components/${componentName}/${componentName}`;
      const componentHtmlPath = `${basePath}.html`;

      try {
        // 1. Intentar cargar JS del componente si existe
        let module = null;
        const jsModuleUrl = `${basePath}.js`;

        try {
          const response = await fetch(jsModuleUrl, { method: 'HEAD' });
          if (response.ok) {
            module = await import(jsModuleUrl);

            // Llamar setupComponent() antes de insertar HTML
            if (typeof module.setupComponent === 'function') {
              module.setupComponent();
            }
          } else {
            console.warn(`ℹ️ JS no encontrado para ${componentName}, se omite`);
          }
        } catch (e) {
          console.warn(`⚠️ Error cargando JS para ${componentName}:`, e.message);
        }

        // 2. Cargar HTML del componente
        const html = await fetch(componentHtmlPath).then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.text();
        });

        // 3. Insertar el HTML en el DOM
        const temp = document.createElement('div');
        temp.innerHTML = html;
        el.replaceWith(...Array.from(temp.childNodes));

        templatesLoadedCount++;
        foundNewIncludes = true;

        // 4. Llamar initComponent() después de insertar el HTML
        if (module && typeof module.initComponent === 'function') {
          module.initComponent();
        }

        console.warn(`✅ Componente cargado: ${componentName}`);
      } catch (err) {
        console.error(`❌ Error al cargar componente: ${componentName}`, err);
      }
    }));
  }

  console.warn(`✅ Proceso completo: ${templatesLoadedCount} componente(s) insertado(s).`);
}
