import {
  crearTextoTarea,
  crearEstimacion,
  crearBotonBorrar,
  crearDivTexto,
  crearTareaArea,
  añadirTarea,
  guardarTarea,
  tareas,
  exportarJSON,
} from "./createTask.js";

function crearTarea() {
  let boton = document.getElementById("botonCrearTarea");

  boton.addEventListener("click", () => {
    guardarTarea();
  });
}

function descargarJSON() {
  let botonExportar = document.getElementById("botonGuardarTarea");

  botonExportar.addEventListener("click", () => {
    exportarJSON(tareas);
  });
}

function renderizar() {
  crearTarea();
  descargarJSON();
}

renderizar();
