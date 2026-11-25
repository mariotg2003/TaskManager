import { useRef, useState } from "react";
import { cargar, guardar, mesActual } from "../lib/storage.js";

export function useTareas() {
  const [inicial] = useState(() => {
    try { return { datos: cargar(), error: "" }; }
    catch (error) { return { datos: null, error: `No se pudieron cargar las tareas: ${String(error)}` }; }
  });
  const [datos, setDatos] = useState(inicial.datos);
  const datosRef = useRef(inicial.datos);
  const [mes, setMes] = useState(mesActual);
  const [errorAlGuardar, setErrorAlGuardar] = useState("");

  const actualizarMes = (fn) => {
    try {
      const current = datosRef.current;
      if (!current) throw new Error("Las tareas no están disponibles.");
      const next = { ...current, meses: { ...current.meses, [mes]: fn(current.meses[mes] ?? []) } };
      guardar(next);
      datosRef.current = next;
      setDatos(next);
      setErrorAlGuardar("");
      return true;
    } catch (error) {
      setErrorAlGuardar(`No se pudieron guardar las tareas: ${String(error)}. El cambio no se ha aplicado.`);
      return false;
    }
  };

  const tareas = datos?.meses[mes] ?? [];

  return {
    mes,
    setMes,
    tareas,
    errorAlGuardar,
    errorAlCargar: inicial.error,
    meses: [...new Set([...Object.keys(datos?.meses ?? {}), mesActual(), mes])].sort().reverse(),
    crear: (tarea) => actualizarMes((l) => [...l, tarea]),
    editar: (id, cambios) =>
      actualizarMes((l) => l.map((t) => (t.id === id ? { ...t, ...cambios } : t))),
    borrar: (id) => actualizarMes((l) => l.filter((t) => t.id !== id)),
    reemplazar: (nuevas) => actualizarMes(() => nuevas),
  };
}
