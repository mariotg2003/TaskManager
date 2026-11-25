# TaskManager

Tablero Kanban (READY → DEV → TEST → DONE) para gestionar las tareas de cada mes. Aplicación React disponible en la web y como aplicación de escritorio con Electron, sin backend.

## Tecnologías

- **React 18**: componentes funcionales y hooks (`useState`, `useEffect`, `useRef`).
- **Vite 5** (+ `@vitejs/plugin-react`): servidor de desarrollo y build.
- **Electron**: ventana de escritorio.
- **CSS3**: variables CSS, Grid, tema oscuro y diseño responsive.
- **`<dialog>` nativo**: formulario de crear/editar tarea.
- **HTML Drag & Drop API**: mover tareas entre columnas.
- **Almacenamiento local**: persistencia automática, agrupada por mes.
- **JSON**: importar/exportar las tareas de un mes.

## Estructura

```text
index.html                 Punto de entrada de la web
vite.config.js             Configuración de Vite
Iniciar TaskManager.vbs    Lanzador de escritorio sin consola
Iniciar TaskManager.cmd    Lanzador alternativo para Windows
src/
  main.jsx                 Arranque de React
  App.jsx                  Tablero, controles e importación/exportación
  desktop.cjs              Ventana de Electron
  components/
    Column.jsx             Columna del tablero
    TaskCard.jsx           Tarjeta de tarea
    TaskDialog.jsx         Diálogo de tarea
    MonthDialog.jsx        Diálogo de mes
  hooks/
    useTareas.js           Estado y persistencia de tareas
  lib/
    storage.js             Modelo, normalización y persistencia
    sync-documents.cjs     Almacenamiento compartido del escritorio
  styles/
    styles.css             Estilos de la aplicación
scripts/                   Lanzadores anteriores de la web local
tareas/                    Ejemplos de JSON mensuales
```

Para modificar la interfaz, empieza por `src/App.jsx` o el componente correspondiente en `src/components/`; los estilos están en `src/styles/styles.css`. El estado por mes se gestiona en `src/hooks/useTareas.js` y el formato de los datos en `src/lib/storage.js`. La configuración de la ventana de escritorio está en `src/desktop.cjs`.

## Pasos para ejecutarlo

1. Instala [Node.js](https://nodejs.org) 22.12 o superior.
2. `npm install`
3. `npm run dev` y abre la URL que indica (normalmente <http://localhost:5173>).
4. `npm run build` genera la versión de producción en `dist/` (`npm run preview` para probarla).

Los comandos web siguen generando la misma versión para publicar. La aplicación de escritorio también utiliza `dist/`, pero con rutas relativas; ejecuta `npm run build` antes de publicar la web.

## Aplicación de escritorio (Windows)

1. Clona o descomprime el proyecto en una carpeta permanente.
2. Desde PowerShell en esa carpeta, ejecuta `npm.cmd install`.
3. Abre `Iniciar TaskManager.vbs` con doble clic. Compila la interfaz y abre la ventana de Electron sin consola. Cierra la ventana para salir.

Para crear un acceso directo, haz clic derecho en `Iniciar TaskManager.vbs` y elige **Enviar a > Escritorio (crear acceso directo)**. El acceso directo necesita que la carpeta del proyecto y `node_modules` permanezcan en su sitio. `Iniciar TaskManager.cmd` también abre la aplicación, pero puede mostrar brevemente una consola.

También puedes usar `npm.cmd run desktop` desde la terminal. Como en MusicConvert, el lanzador necesita Node.js y las dependencias del proyecto; no genera un instalador independiente. La aplicación funciona sin servidor y sin conexión.

La aplicación de escritorio guarda sus tareas en `%LOCALAPPDATA%\WorkPanel\sync-documents.sqlite3`; los navegadores utilizan su propio `localStorage`. Al abrir esta versión de escritorio por primera vez, migra automáticamente las tareas anteriores y conserva la copia original. No sigas usando versiones antiguas de TaskManager tras migrar, ya que modificarían esa copia antigua.

WorkPanel permite sincronizar las tareas del escritorio con Android de forma manual y experimental. Si TaskManager estaba abierto durante una importación, ciérralo y vuelve a abrirlo para ver los cambios; se rechazan guardados basados en datos antiguos. Las eliminaciones no se propagan. La web y el escritorio siguen guardando sus datos por separado: también puedes trasladar tareas exportando e importando el JSON de cada mes, operación que reemplaza el mes de destino.

El acceso directo anterior (`scripts\crear-acceso-directo.ps1`) sigue disponible y abre la versión web local en Edge o Chrome; no abre Electron y conserva sus propios datos del navegador.

## Uso

1. Elige o crea un mes (`+ Mes`, formato `AAAA-MM`).
2. `Añadir tarea`: nombre y prioridad (BAJO / MEDIO / ALTO).
3. Mueve las tareas arrastrándolas o con ◀ ▶. Edita (✎) o borra (🗑) desde cada tarjeta.
4. Los cambios se guardan solos en el almacenamiento local de la aplicación o del navegador.
5. `Exportar JSON` descarga las tareas del mes; `Importar JSON` las carga en el mes seleccionado (reemplazándolas). Acepta el formato antiguo (`tareas/TareasOctubre.json`) y el nuevo (array).

## Formato JSON

```json
[
  { "id": "uuid", "texto": "Aprender React", "estimacion": "ALTO", "estado": "Dev" }
]
```

`estado`: `Ready`, `Dev`, `Test` o `Done`.