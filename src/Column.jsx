import { useState } from "react";
import TaskCard from "./TaskCard.jsx";

export default function Column({ estado, tareas, onMover, onEditar, onBorrar }) {
  const [sobre, setSobre] = useState(false);

  return (
    <section>
      <h2>
        {estado.toUpperCase()} <span className="contador">{tareas.length}</span>
      </h2>
      <div
        className={`tablon${sobre ? " destino" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setSobre(true);
        }}
        onDragLeave={() => setSobre(false)}
        onDrop={(e) => {
          e.preventDefault();
          setSobre(false);
          onMover(e.dataTransfer.getData("text/plain"), estado);
        }}
      >
        {tareas.map((t) => (
          <TaskCard
            key={t.id}
            tarea={t}
            onMover={onMover}
            onEditar={onEditar}
            onBorrar={onBorrar}
          />
        ))}
      </div>
    </section>
  );
}
