import { Modal, createModal } from "./Modal.js";

//CLASE TASK PARA CREAR LAS TAREAS
export class Task {
  static contadorTarea = 0;
  static botonPulsado = false;

  constructor(texto = "", estimacion = 0) {
    this.texto = texto;
    this.estimacion = estimacion;
    this.id = Task.contadorTarea++;
  }

  crearTextoTarea() {
    let p = document.createElement("p");
    p.innerHTML = this.texto;
    p.className = "col-7";
    p.style.textAlign = "center";
    p.style.fontSize = "1.2em";
    p.style.fontWeight = "bold";
    p.style.marginTop = "0.8em";

    return p;
  }

  crearEstimacion() {
    let divEstimacion = document.createElement("div");
    divEstimacion.innerHTML = this.estimacion;
    divEstimacion.className = "col-2";
    divEstimacion.style.textAlign = "center";
    divEstimacion.style.marginTop = "0.8em";
    divEstimacion.style.fontSize = "1.2em";

    return divEstimacion;
  }

  crearBotonBorrar() {
    let botonBorrar = document.createElement("button");
    botonBorrar.className = "btn btn-secondary col-3 botonBorrar";
    botonBorrar.innerHTML = "Borrar Tarea";

    botonBorrar.addEventListener("click", () => {
      this.botonPulsado = true;
      if (confirm("¿Quieres borrar esta tarea?")) {
        delete tareas[this.id];
        document.getElementById(this.id).remove();
      }
    });

    return botonBorrar;
  }

  crearDivTexto() {
    let divTextos = document.createElement("div");
    divTextos.className = "row col-12 textoTareas";

    return divTextos;
  }

  crearTareaArea() {
    let divTarea = document.createElement("div");
    divTarea.className = "tarea col-10";

    return divTarea;
  }
}

export let tareas = {};

// FUNCION PARA AÑADIR TAREA AL CUADRO DE TAREAS NO EMPEZADAS
export function añadirTarea(tareaNueva) {
  let divTareas = document.getElementById("tareasNoEmpezadas");
  let tarea = tareaNueva;
  tarea.estimacion = tarea.estimacion;
  tarea.id = tarea.id;

  let p = tarea.crearTextoTarea();
  let divEstimacion = tarea.crearEstimacion();
  let divTextos = tarea.crearDivTexto();
  let divTarea = tarea.crearTareaArea();
  let botonBorrar = tarea.crearBotonBorrar();

  divTextos.appendChild(p);
  divTextos.appendChild(divEstimacion);
  divTextos.appendChild(botonBorrar);
  divTarea.appendChild(divTextos);

  divTarea.id = tarea.id;
  console.log(divTarea.id, " este es el id de la tarea");
  divTarea.addEventListener("click", () => {
    if (tarea.botonPulsado) {
      tarea.botonPulsado = false;
      return;
    } else {
      createModal(
        tarea.texto,
        `Estimación: ${tarea.estimacion} horas`,
        tarea.id,
        tareas
      );
    }
  });

  divTareas.append(divTarea);
}

// FUNCION PARA AÑADIR TAREA AL ARRAY DE TAREAS Y CREARLAS LLAMANDO A LA FUNCION AÑADIR TAREA
export function guardarTarea() {
  let tarea = new Task();

  let textoTarea = document.getElementById("nombreTarea");
  let texto = textoTarea.value;
  let numeroEstimacion = document.getElementById("estimacionTarea");
  let estimacion = numeroEstimacion.value;

  if (texto !== "" && estimacion !== "") {
    tarea.texto = texto;
    tarea.estimacion = estimacion;
    tarea.id = Task.contadorTarea++;
    añadirTarea(tarea);
    tareas[tarea.id] = tarea;
    textoTarea.value = "";
    numeroEstimacion.value = "";
  } else {
    alert("Introduce los datos bien por favor");
  }
}

// FUNCION PARA EXPORTAR EL JSON DE LAS TAREAS
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
