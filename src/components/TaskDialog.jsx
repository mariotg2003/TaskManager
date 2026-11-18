import { useEffect, useRef, useState } from "react";
import { PRIORIDADES } from "../lib/storage.js";

export default function TaskDialog({ tarea, onGuardar, onCerrar }) {
  const ref = useRef(null);
  const [texto, setTexto] = useState(tarea?.texto ?? "");
  const [estimacion, setEstimacion] = useState(tarea?.estimacion ?? "MEDIO");

  useEffect(() => {
    if (!ref.current.open) ref.current.showModal();
  }, []);

  const enviar = (e) => {
    e.preventDefault();
    if (texto.trim()) onGuardar({ texto: texto.trim(), estimacion });
  };

  return (
    <dialog ref={ref} onClose={onCerrar}>
      <form onSubmit={enviar}>
        <h3>{tarea ? "Editar tarea" : "Nueva tarea"}</h3>
        <label>
          Nombre
          <input
            type="text"
            autoFocus
            required
            maxLength={120}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="¿Qué hay que hacer?"
          />
        </label>
        <label>
          Prioridad
          <select value={estimacion} onChange={(e) => setEstimacion(e.target.value)}>
            {PRIORIDADES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <div className="dialogo-acciones">
          <button type="button" className="btn" onClick={() => ref.current.close()}>
            Cancelar
          </button>
          <button type="submit" className="btn primario">
            Guardar
          </button>
        </div>
      </form>
    </dialog>
  );
}
