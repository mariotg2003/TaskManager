# TaskManager

Tablero Kanban (READY → DEV → TEST → DONE) para gestionar las tareas de cada mes. Aplicación React que funciona 100 % en el navegador, sin backend.

## Tecnologías

- **React 18**: componentes funcionales y hooks (`useState`, `useEffect`, `useRef`).
- **Vite 5** (+ `@vitejs/plugin-react`): servidor de desarrollo y build.
- **CSS3**: variables CSS, Grid, tema oscuro y diseño responsive.
- **`<dialog>` nativo**: formulario de crear/editar tarea.
- **HTML Drag & Drop API**: mover tareas entre columnas.
- **localStorage**: persistencia automática, agrupada por mes.
- **JSON**: importar/exportar las tareas de un mes.

## Estructura

```
index.html              Punto de entrada de Vite
vite.config.js
src/main.jsx            Arranque de React
src/App.jsx             Cabecera, meses, importar/exportar
src/Column.jsx          Columna del tablero (zona de drop)
src/TaskCard.jsx        Tarjeta de tarea (drag, mover, editar, borrar)
src/TaskDialog.jsx      Diálogo de creación/edición
src/useTareas.js        Hook de estado + persistencia
src/storage.js          Modelo, normalización y localStorage
src/styles.css          Estilos
tareas/                 Ejemplos de JSON mensuales
```

## Pasos para ejecutarlo

1. Instala [Node.js](https://nodejs.org) 18 o superior.
2. `npm install`
3. `npm run dev` y abre la URL que indica (normalmente <http://localhost:5173>).
4. `npm run build` genera la versión de producción en `dist/` (`npm run preview` para probarla).

## Acceso directo de escritorio (Windows)

Ejecuta una vez `powershell -ExecutionPolicy Bypass -File scripts\crear-acceso-directo.ps1`. Se crea `TaskManager.lnk` en el escritorio: arranca un servidor local en el puerto fijo 4173 (para conservar los datos del navegador) y abre la app en una ventana propia con Edge o Chrome (`--app`). Si cambias el código, ejecuta `npm run build` para que el acceso directo use la versión nueva.

El servidor queda en segundo plano al cerrar la ventana; para pararlo, finaliza el proceso `node` que escucha en el puerto 4173.

## Uso

1. Elige o crea un mes (`+ Mes`, formato `AAAA-MM`).
2. `Añadir tarea`: nombre y prioridad (BAJO / MEDIO / ALTO).
3. Mueve las tareas arrastrándolas o con ◀ ▶. Edita (✎) o borra (🗑) desde cada tarjeta.
4. Los cambios se guardan solos en el navegador.
5. `Exportar JSON` descarga las tareas del mes; `Importar JSON` las carga en el mes seleccionado (reemplazándolas). Acepta el formato antiguo (`tareas/TareasOctubre.json`) y el nuevo (array).

## Formato JSON

```json
[
  { "id": "uuid", "texto": "Aprender React", "estimacion": "ALTO", "estado": "Dev" }
]
```

`estado`: `Ready`, `Dev`, `Test` o `Done`.