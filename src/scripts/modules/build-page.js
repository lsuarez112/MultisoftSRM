/**
 * build-page.js
 *
 * Compila el CSS de una página junto con todos los componentes usados directa o recursivamente.
 *
 * Requiere:
 * - Un archivo ./<pagina>.html (por ejemplo login.html)
 * - Un archivo de entrada .MultisoftSRM/src/pages/<pagina>/<pagina>.css
 * - Componentes en .MultisoftSRM/src/components/<componente>/<componente>.html
 *
 * Uso:
 *   node scripts/build-page.js login
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';

// 📦 Ruta base de componentes
const componentsRoot = '.MultisoftSRM/src/components';

const page = process.argv[2];
if (!page) {
    console.error('⚠️  Debés pasar un nombre de página: node scripts/build-page-full.js <nombre>');
    process.exit(1);
}

const htmlPath = `./${page}.html`;
const cssInput = `.MultisoftSRM/src/pages/${page}/${page}.css`;
const cssOutput = `.MultisoftSRM/src/pages/${page}/output.css`;
const configPath = `./tailwind.config.${page}.js`;

if (!existsSync(htmlPath) || !existsSync(cssInput)) {
    console.error(`❌ Faltan archivos: ${htmlPath} o ${cssInput}`);
    process.exit(1);
}

// 🧠 Analizar includes recursivos
function extractIncludesFromHtml(html) {
    const regex = /data-include\s*=\s*"([^"]+)"/g;
    const includes = new Set();
    let match;
    while ((match = regex.exec(html)) !== null) {
        includes.add(match[1]);
    }
    return [...includes];
}

const processed = new Set();
const queue = new Set();

let baseHtml = readFileSync(htmlPath, 'utf-8');
extractIncludesFromHtml(baseHtml).forEach(c => queue.add(c));

// 🔁 Recursividad
while (queue.size > 0) {
    const component = queue.values().next().value;
    queue.delete(component);
    processed.add(component);

    const htmlPath = join(componentsRoot, component, `${component}.html`);
    if (existsSync(htmlPath)) {
        const html = readFileSync(htmlPath, 'utf-8');
        extractIncludesFromHtml(html).forEach(c => {
            if (!processed.has(c)) queue.add(c);
        });
    }
}

console.log(`📦 Componentes detectados:`, [...processed]);

// 🧾 Generar configuración temporal de Tailwind
const contentPaths = [
    `./${page}.html`,
    ...[...processed].map(c => `.MultisoftSRM/src/components/${c}/*.{html,js,css}`)
];

const configContent = `
  export default {
    content: ${JSON.stringify(contentPaths, null, 2)},
    darkMode: 'class',
    theme: {
      extend: {},
    },
    plugins: [],
  }
`;

const isWatch = process.argv.includes('--watch');

try {
    writeFileSync(configPath, configContent);
    console.log(`⚙️  Config temporal generado: ${configPath}`);

    const cmd = `npx @tailwindcss/cli -c ${configPath} -i ${cssInput} -o ${cssOutput} ${isWatch ? '--watch' : ''}`;
    execSync(cmd, { stdio: 'inherit' });

    console.log(`✅ CSS compilado: ${cssOutput}`);
} catch (err) {
    console.error(`❌ Error al compilar la página "${page}"`, err);
} finally {
    try {
        if (!isWatch) {
            unlinkSync(configPath);
            console.log(`🧹 Config temporal eliminado: ${configPath}`);
        }
    } catch (e) {
        console.warn(`⚠️  No se pudo eliminar: ${configPath}`, e);
    }
}
