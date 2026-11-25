export const ESTADOS = ["Ready", "Dev", "Test", "Done"];
export const PRIORIDADES = ["BAJO", "MEDIO", "ALTO"];

const CLAVE = "taskmanager.v2";
let expectedShared = null;
let expectedLocal = null;

export function validStoredTasks(raw) {
  if (raw === null) return true;
  const data = JSON.parse(raw);
  if (!data || typeof data !== "object" || !data.meses || typeof data.meses !== "object" || Array.isArray(data.meses)) return false;
  return Object.entries(data.meses).every(([month, tasks]) => {
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month) || !Array.isArray(tasks)) return false;
    const ids = new Set();
    return tasks.every((task) => {
      if (!task || typeof task.id !== "string" || !task.id || ids.has(task.id) ||
          typeof task.texto !== "string" || !task.texto.trim() ||
          !ESTADOS.includes(task.estado) || !PRIORIDADES.includes(task.estimacion)) return false;
      ids.add(task.id);
      return true;
    });
  });
}

export function mesActual() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function etiquetaMes(clave) {
  const [anio, mes] = clave.split("-").map(Number);
  const nombre = new Date(anio, mes - 1, 1).toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });
  return nombre.charAt(0).toUpperCase() + nombre.slice(1);
}

export function normalizarPrioridad(valor) {
  const v = String(valor ?? "").trim().toUpperCase();
  if (v.startsWith("ALT")) return "ALTO";
  if (v.startsWith("BAJ")) return "BAJO";
  return "MEDIO";
}

export function crearTarea({ texto, estimacion, estado }) {
  return {
    id: crypto.randomUUID(),
    texto: String(texto ?? "").trim(),
    estimacion: normalizarPrioridad(estimacion),
    estado: ESTADOS.includes(estado) ? estado : "Ready",
  };
}

// Acepta el formato antiguo (objeto indexado por id) y el nuevo (array).
export function normalizarImportacion(datos) {
  const lista = Array.isArray(datos)
    ? datos
    : datos && typeof datos === "object"
    ? Object.values(datos)
    : null;
  if (!lista) throw new Error("El archivo JSON no tiene el formato correcto.");
  return lista.map((t) => {
    if (!t || typeof t.texto !== "string" || !t.texto.trim()) {
      throw new Error("Hay tareas sin texto válido.");
    }
    return crearTarea(t);
  });
}

export function cargar() {
  if (window.taskSync) {
    let raw = window.taskSync.read();
    if (raw === null) {
      raw = localStorage.getItem(CLAVE);
      if (!validStoredTasks(raw)) throw new Error("Las tareas guardadas no tienen un formato válido.");
      if (raw === null) raw = JSON.stringify({ meses: {} });
      window.taskSync.write(null, raw);
    }
    if (!validStoredTasks(raw)) throw new Error("Las tareas compartidas no tienen un formato válido.");
    expectedShared = raw;
    return JSON.parse(raw);
  }
  const raw = localStorage.getItem(CLAVE);
  expectedLocal = raw;
  if (raw === null) return { meses: {} };
  if (!validStoredTasks(raw)) throw new Error("Las tareas guardadas no tienen un formato válido.");
  return JSON.parse(raw);
}

export function guardar(datos) {
  const raw = JSON.stringify(datos);
  if (window.taskSync) {
    window.taskSync.write(expectedShared, raw);
    expectedShared = raw;
  } else {
    if (localStorage.getItem(CLAVE) !== expectedLocal) throw new Error("Las tareas cambiaron en otra aplicación. Recarga antes de guardar.");
    localStorage.setItem(CLAVE, raw);
    expectedLocal = raw;
  }
}
