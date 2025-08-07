export let tareas = {};
let contadorTarea = 0;

export function crearTextoTarea(tarea) {
  let p = document.createElement("p");
  p.innerHTML = tarea.texto;
  p.className = "col-7";

  return p;
}

export function crearEstimacion(tarea) {
  let divEstimacion = document.createElement("div");
  divEstimacion.innerHTML = tarea.estimacion;
  divEstimacion.className = "col-3";

  return divEstimacion;
}

export function crearBotonBorrar(tarea) {
  let botonBorrar = document.createElement("button");
  botonBorrar.className = "btn btn-secondary col-2 botonBorrar";
  botonBorrar.innerHTML = "Borrar Tarea";

  botonBorrar.addEventListener("click", () => {
    if (confirm("¿Quieres borrar esta tarea?")) {
      delete tareas[tarea.id];
      document.getElementById(tarea.id).remove();
    }
  });

  return botonBorrar;
}

export function crearDivTexto() {
  let divTextos = document.createElement("div");
  divTextos.className = "row col-12 textoTareas";

  return divTextos;
}

export function crearTareaArea() {
  let divTarea = document.createElement("div");
  divTarea.className = "tarea";

  return divTarea;
}

export function añadirTarea(tareaNueva) {
  let divTareas = document.getElementById("contenedorTareas");

  let tarea = {};

  tarea.texto = tareaNueva.texto;
  console.log(tarea.texto);
  tarea.estimacion = tareaNueva.estimacion;
  tarea.id = tareaNueva.id;

  let p = crearTextoTarea(tarea);
  let divEstimacion = crearEstimacion(tarea);
  let divTextos = crearDivTexto();
  let divTarea = crearTareaArea();
  let botonBorrar = crearBotonBorrar(tarea);

  divTextos.appendChild(p);
  divTextos.appendChild(divEstimacion);
  divTextos.appendChild(botonBorrar);
  divTarea.appendChild(divTextos);

  divTarea.id = tarea.id;

  divTareas.append(divTarea);
}

export function guardarTarea() {
  let tarea = {};

  let textoTarea = document.getElementById("nombreTarea");
  let texto = textoTarea.value;
  let numeroEstimacion = document.getElementById("estimacionTarea");
  let estimacion = numeroEstimacion.value;

  if ((texto !== "") & (estimacion !== "")) {
    tarea.texto = texto;
    tarea.estimacion = estimacion;
    tarea.id = contadorTarea;
    contadorTarea += 1;
    añadirTarea(tarea);
    tareas[tarea.id] = tarea;
    textoTarea.value = "";
    numeroEstimacion.value = "";
  } else {
    alert("Introduce los datos bien por favor");
  }
}

export function exportarJSON(tareas) {
  console.log(tareas);
  console.log(Object.keys(tareas));
  if (Object.keys(tareas).length === 0) {
    alert("NO SE PUEDE EXPORTAR PORQUE NO HAY TAREAS!");
  } else {
    const jsonString = JSON.stringify(tareas, null, 2);

    // Crear un blob con el contenido JSON
    const blob = new Blob([jsonString], { type: "application/json" });

    // Crear un enlace temporal para descargar
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const fechaLocal = new Date().toLocaleString();
    a.href = url;
    a.download = `tareas-${fechaLocal}.json`;
    document.body.appendChild(a);
    a.click();

    // Limpiar
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
