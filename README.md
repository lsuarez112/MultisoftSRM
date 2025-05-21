# 📦 MTS WMS - Sistema de Gestión de Almacenes

**Desarrollado por [MultiSoft Software](https://www.multisoft.com.ar)**

Este proyecto es un sistema multipágina para la gestión de almacenes (WMS), orientado a optimizar tareas de picking, packing y control de pedidos. Está construido con tecnologías modernas como **Tailwind CSS**, **jQuery** y **Vite**, y está pensado para funcionar de forma modular y eficiente.

---

## 🎯 Objetivo del Proyecto

El sistema busca cubrir distintas etapas del flujo de mercadería:

1. **PickingBrowse**: Selección de notas de pedido agrupadas por consolidado.
2. **PickingForm**: Proceso de recolección de productos.
3. **PickingControl**: Validación de artículos recolectados por supervisores.
4. **PackingBrowse**: Armado de pedidos a partir de consolidado y notas de pedido.
5. **PackingForm**: Asignación de cantidades reales, observaciones y finalización.
6. **PackingControl**: Auditoría de pedidos armados para verificar conformidad.

Las interfaces están pensadas para operarios, supervisores y personal administrativo.

---

## 🛠️ Tecnologías Utilizadas

- **Tailwind CSS 4** (con CLI por página)
- **Vite** como dev server y bundler
- **jQuery** para manipulación rápida del DOM
- **ESModules** para organización modular de scripts

---

## 📁 Estructura del Proyecto

```
project/
├── index.html
├── login.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── package.json
└── src/
    ├── pages/
    │   ├── login/
    │   │   ├── login.css
    │   │   ├── login.js
    │   │   └── output.css
    │   ├── picking/
    │   ├── packing/
    ├── scripts/
    │   └── modules/
    │       ├── init.js
    │       └── darkmode.js
    └── images/
```

Cada página tendrá su propio CSS generado por Tailwind para optimizar el peso del sitio.

---

## 🚀 Cómo iniciar el proyecto

1. Instalar dependencias:

```bash
pnpm install
```

2. Compilar todos los CSS:

```bash
pnpm build:all
```

3. Iniciar el servidor local:

```bash
pnpm dev
```

4. Abrí `http://localhost:5173/login.html` (o cualquier otra página)

---

## 📌 Páginas planificadas

✅ `login.html`
🔄 `picking-browse.html`
🔄 `picking-form.html`
🔄 `picking-control.html`
🔄 `packing-browse.html`
🔄 `packing-form.html`
🔄 `packing-control.html`

Cada una incluirá:

- Archivo HTML
- Script específico (`.js`)
- Estilos dedicados (`.css` compilado por Tailwind)

---

## 🧠 Mantenimiento

Este proyecto está desarrollado y mantenido por el equipo de soporte técnico de **MultiSoft Software**. Para consultas o soporte técnico, visitá [multisoft.com.ar](https://www.multisoft.com.ar).

---

## 📄 Licencia

Este software está licenciado bajo el modelo **MTS (MultiSoft Tailored Software)**.

---

¿Listo para transformar tu almacén? 💪
