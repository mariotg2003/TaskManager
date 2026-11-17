import { useState } from "react";
import { ESTADOS } from "./storage.js";

export default function TaskCard({ tarea, onMover, onEditar, onBorrar }) {
  const [arrastrando, setArrastrando] = useState(false);
  const idx = ESTADOS.indexOf(tarea.estado);

  return (
    <article
      className={`tarjeta prioridad-${tarea.estimacion.toLowerCase()}${arrastrando ? " arrastrando" : ""}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", tarea.id);
        setArrastrando(true);
      }}
      onDragEnd={() => setArrastrando(false)}
    >
      <p className="tarjeta-texto">{tarea.texto}</p>
      <span className="badge">{tarea.estimacion}</span>
      <div className="tarjeta-acciones">
        {idx > 0 && (
          <button title="Retroceder" onClick={() => onMover(tarea.id, ESTADOS[idx - 1])}>
            ◀
          </button>
        )}
        {idx < ESTADOS.length - 1 && (
          <button title="Avanzar" onClick={() => onMover(tarea.id, ESTADOS[idx + 1])}>
            ▶
          </button>
        )}
        <button title="Editar" onClick={() => onEditar(tarea)}>
          ✎
        </button>
        <button
          title="Borrar"
          className="peligro"
          onClick={() => confirm("¿Quieres borrar esta tarea?") && onBorrar(tarea.id)}
        >
          🗑
        </button>
      </div>
    </article>
  );
}
