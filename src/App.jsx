import { useRef, useState } from "react";
import Column from "./components/Column.jsx";
import MonthDialog from "./components/MonthDialog.jsx";
import TaskDialog from "./components/TaskDialog.jsx";
import { useTareas } from "./hooks/useTareas.js";
import { ESTADOS, crearTarea, etiquetaMes, normalizarImportacion } from "./lib/storage.js";

export default function App({ exportJson, importJson } = {}) {
  const { mes, setMes, meses, tareas, crear, editar, borrar, reemplazar, errorAlGuardar, errorAlCargar } = useTareas();
  const [dialogo, setDialogo] = useState(null); // null | { tarea }
  const [dialogoMes, setDialogoMes] = useState(false);
  const [aviso, setAviso] = useState("");
  const inputArchivo = useRef(null);
  const temporizador = useRef();

  if (errorAlCargar) return <p role="alert" className="vacio">{errorAlCargar} No se sobrescribirán los datos guardados. Cierra la aplicación y vuelve a abrirla después de resolver el problema.</p>;

  const toast = (msg) => {
    setAviso(msg);
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setAviso(""), 2500);
  };

  const mover = (id, estado) => {
    const t = tareas.find((x) => x.id === id);
    if (t && t.estado !== estado) editar(id, { estado });
  };

  const guardarDialogo = (campos) => {
    const saved = dialogo.tarea ? editar(dialogo.tarea.id, campos) : crear(crearTarea(campos));
    if (saved) setDialogo(null);
  };

  const nuevoMes = (valor) => {
    setMes(valor);
    setDialogoMes(false);
  };

  const exportar = async () => {
    if (!tareas.length) return toast("No hay tareas que exportar");
    try {
      const contents = JSON.stringify(tareas, null, 2);
      if (exportJson) {
        if (await exportJson(`Tareas-${mes}.json`, contents)) toast("Tareas exportadas");
        return;
      }
      const blob = new Blob([contents], { type: "application/json" });
      const a = Object.assign(document.createElement("a"), {
        href: URL.createObjectURL(blob),
        download: `Tareas-${mes}.json`,
      });
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (error) {
      toast(`No se pudieron exportar las tareas: ${String(error)}`);
    }
  };

  const importarTexto = (texto) => {
    const nuevas = normalizarImportacion(JSON.parse(texto));
    if (tareas.length && !confirm("Se reemplazarán las tareas de este mes. ¿Continuar?")) return;
    if (reemplazar(nuevas)) toast(`${nuevas.length} tareas importadas`);
  };

  const importar = async (e) => {
    try {
      if (importJson) {
        const texto = await importJson();
        if (texto !== null) importarTexto(texto);
      } else {
        const archivo = e.target.files[0];
        e.target.value = "";
        if (archivo) importarTexto(await archivo.text());
      }
    } catch (err) {
      toast("Error al importar: " + String(err));
    }
  };

  return (
    <>
      <header className="cabecera">
        <h1>Sprint</h1>
        <div className="controles">
          <select value={mes} onChange={(e) => setMes(e.target.value)} aria-label="Mes">
            {meses.map((m) => (
              <option key={m} value={m}>
                {etiquetaMes(m)}
              </option>
            ))}
          </select>
          <button className="btn" onClick={() => setDialogoMes(true)}>+ Mes</button>
          <button className="btn primario" onClick={() => setDialogo({ tarea: null })}>
            Añadir tarea
          </button>
          <button className="btn" onClick={exportar}>Exportar JSON</button>
          <button className="btn" onClick={importJson ? importar : () => inputArchivo.current.click()}>
            Importar JSON
          </button>
          <input ref={inputArchivo} type="file" accept=".json,application/json" hidden onChange={importar} />
        </div>
      </header>

      {errorAlGuardar && <p role="alert" className="vacio">{errorAlGuardar}</p>}
      {!tareas.length && <p className="vacio">No hay tareas este mes. Crea una o importa un JSON.</p>}

      <main className="tablero">
        {ESTADOS.map((estado) => (
          <Column
            key={estado}
            estado={estado}
            tareas={tareas.filter((t) => t.estado === estado)}
            onMover={mover}
            onEditar={(tarea) => setDialogo({ tarea })}
            onBorrar={borrar}
          />
        ))}
      </main>

      {dialogo && (
        <TaskDialog
          tarea={dialogo.tarea}
          error={errorAlGuardar}
          onGuardar={guardarDialogo}
          onCerrar={() => setDialogo(null)}
        />
      )}
      {dialogoMes && (
        <MonthDialog mes={mes} onGuardar={nuevoMes} onCerrar={() => setDialogoMes(false)} />
      )}
      <div id="toast" role="status" className={aviso ? "visible" : ""}>{aviso}</div>
    </>
  );
}
