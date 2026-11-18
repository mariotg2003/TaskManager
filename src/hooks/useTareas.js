import { useEffect, useState } from "react";
import { cargar, guardar, mesActual } from "../lib/storage.js";

export function useTareas() {
  const [datos, setDatos] = useState(cargar);
  const [mes, setMes] = useState(mesActual);

  useEffect(() => guardar(datos), [datos]);

  const tareas = datos.meses[mes] ?? [];

  const actualizarMes = (fn) =>
    setDatos((d) => ({
      ...d,
      meses: { ...d.meses, [mes]: fn(d.meses[mes] ?? []) },
    }));

  return {
    mes,
    setMes,
    tareas,
    meses: [...new Set([...Object.keys(datos.meses), mesActual(), mes])].sort().reverse(),
    crear: (tarea) => actualizarMes((l) => [...l, tarea]),
    editar: (id, cambios) =>
      actualizarMes((l) => l.map((t) => (t.id === id ? { ...t, ...cambios } : t))),
    borrar: (id) => actualizarMes((l) => l.filter((t) => t.id !== id)),
    reemplazar: (nuevas) => actualizarMes(() => nuevas),
  };
}
