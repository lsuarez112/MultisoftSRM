/**
 * 
 * template-engine.js
 *
 * Sistema de carga dinámica y recursiva de componentes HTML con JavaScript vanilla.
 *
 * Funcionalidad:
 * - Inserta HTML donde haya `data-include="[componente]"`
 * - Carga y ejecuta el JS asociado si tiene un `initComponent()`
 * - No carga CSS (los estilos se incluyen en el output final de la página)
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
        // 1. Cargar HTML del componente
        const html = await fetch(componentHtmlPath).then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.text();
        });


        

        // 2. Insertar el HTML en el DOM
        const temp = document.createElement('div');
        temp.innerHTML = html;
        el.replaceWith(...Array.from(temp.childNodes));
        Alpine.initTree(temp);

        templatesLoadedCount++;
        foundNewIncludes = true;

        // 3. Intentar cargar JS del componente si existe
        try {
          const jsModuleUrl = `${basePath}.js`;

          // Verificar primero si el JS existe
          const response = await fetch(jsModuleUrl, { method: 'HEAD' });
          if (response.ok) {
            const module = await import(jsModuleUrl);
            if (typeof module.initComponent === 'function') {
              module.initComponent();
            }
          } else {
            console.warn(`ℹ️ JS no encontrado para ${componentName}, se omite`);
          }

        } catch (e) {
          console.warn(`⚠️ Error cargando JS para ${componentName}:`, e.message);
        }

        console.warn(`✅ Componente cargado: ${componentName}`);
      } catch (err) {
        console.error(`❌ Error al cargar componente: ${componentName}`, err);
      }
    }));
  }

  console.warn(`✅ Proceso completo: ${templatesLoadedCount} componente(s) insertado(s).`);
}
