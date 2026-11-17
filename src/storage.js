export const ESTADOS = ["Ready", "Dev", "Test", "Done"];
export const PRIORIDADES = ["BAJO", "MEDIO", "ALTO"];

const CLAVE = "taskmanager.v2";

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
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE));
    if (datos && typeof datos.meses === "object") return datos;
  } catch {
    // datos corruptos: se empieza de cero
  }
  return { meses: {} };
}

export function guardar(datos) {
  localStorage.setItem(CLAVE, JSON.stringify(datos));
}
