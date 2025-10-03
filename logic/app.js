import {
  Task,
  guardarTarea,
  tareas,
  exportarJSON,
  abrirSelectorArchivo,
} from "./clases/Task.js";

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
  abrirSelectorArchivo(tareas);
}

renderizar();
