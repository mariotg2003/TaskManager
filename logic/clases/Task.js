import { Modal, createModal } from "./Modal.js";

//CLASE TASK PARA CREAR LAS TAREAS
export class Task {
  static contadorTarea = 0;
  static botonPulsado = false;

  constructor(texto = "", estimacion = 0, estado = "Ready") {
    this.texto = texto;
    this.estimacion = estimacion;
    this.id = Task.contadorTarea++;
    this.estado = this.estado;
  }

  crearTextoTarea() {
    let p = document.createElement("p");
    p.innerHTML = this.texto;
    p.className = "col-6";
    p.style.textAlign = "center";
    p.style.fontSize = "1.2em";
    p.style.fontWeight = "bold";
    p.style.marginTop = "0.8em";

    return p;
  }

  crearEstimacion() {
    let divEstimacion = document.createElement("div");
    divEstimacion.innerHTML = this.estimacion;
    divEstimacion.className = "col-3";
    divEstimacion.style.textAlign = "center";
    divEstimacion.style.height = "2em";
    divEstimacion.style.marginTop = "0.8em";
    divEstimacion.style.fontSize = "1em";

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
    divTarea.style.display = "flex";
    divTarea.style.flexWrap = "wrap";
    divTarea.className = "tarea col-10";

    return divTarea;
  }
}

export let tareas = {};

// FUNCION PARA AÑADIR TAREA AL CUADRO DE TAREAS NO EMPEZADAS
export function añadirTarea(tareaNueva) {
  let divTareas;
  switch (tareaNueva.estado) {
    case "Ready":
      divTareas = document.getElementById("tareasNoEmpezadas");
      break;
    case "Dev":
      divTareas = document.getElementById("tareasDesarrollo");
      break;
    case "Test":
      divTareas = document.getElementById("tareasTesting");
      break;
    case "Done":
      divTareas = document.getElementById("tareasTerminadas");
      break;
    default:
      divTareas = document.getElementById("tareasNoEmpezadas");
      break;
  }

  let tarea = tareaNueva;
  tarea.estimacion = tarea.estimacion;
  tarea.id = tarea.id;
  tarea.estado = "Ready";

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
    tarea.estado = "Ready";
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

export function abrirSelectorArchivo(tareas) {
  let botonImportar = document.getElementById("botonExportarTarea");
  botonImportar.addEventListener("click", () => {
    const elementoInput = document.createElement("input");
    elementoInput.type = "file";
    elementoInput.accept = ".json,application/json";
    elementoInput.click();

    elementoInput.addEventListener("change", (event) => {
      importarJSON(event.target.files[0], tareas);
    });
  });
}

function resetTareas(tareas) {
  if (Object.keys(tareas).length > 0) {
    console.log("borrando tareas");
    let tareasBorra = document.getElementsByClassName("tarea");
    console.log(tareasBorra);
    let tareasBorraArray = Array.from(tareasBorra);
    tareasBorraArray.forEach((tarea) => tarea.remove());
    tareas = {};
  }
}

//FUNCION PARA LEER LAS TAREAS
function pintarTareas(tareas) {
  console.log(tareas);
  for (let key in tareas) {
    añadirTarea(tareas[key]);
  }
}

//FUNCION PARA IMPORTAR LAS TAREAS
function importarJSON(file, dict) {
  console.log(Object.keys(dict).length);
  resetTareas(dict);
  const lector = new FileReader();
  lector.onload = (evento) => {
    try {
      const contenido = evento.target.result;
      const tareasImportadas = JSON.parse(contenido);
      if (typeof tareasImportadas !== "object" || tareasImportadas === null) {
        throw new Error("El archivo JSON no tiene el formato correcto.");
      } else {
        for (let key in tareasImportadas) {
          if (
            !tareasImportadas[key].hasOwnProperty("texto") ||
            !tareasImportadas[key].hasOwnProperty("estimacion")
          ) {
            throw new Error("El archivo JSON no tiene el formato correcto.");
          }
        }
      }

      for (let key in tareasImportadas) {
        let tarea = new Task(
          tareasImportadas[key].texto,
          tareasImportadas[key].estimacion
        );
        tarea.id = Task.contadorTarea++;
        añadirTarea(tarea);
        tareas[tarea.id] = tarea;
      }
      alert("Tareas importadas correctamente.");
    } catch (error) {
      alert("Error al importar el archivo JSON: " + error.message);
    } finally {
      lector.abort();
    }
  };
  lector.readAsText(file);
}
