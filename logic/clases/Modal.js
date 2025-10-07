import { añadirTarea, borrarTarea } from "./Task.js";
export class Modal {
  constructor(
    titulo = "Título del Modal",
    contenido = "Contenido de la tarea",
    tareaId = null,
    tareas,
    estado = "Ready"
  ) {
    this.titulo = titulo;
    this.contenido = contenido;
    this.tareaId = tareaId;
    this.tareas = tareas;
    this.estado = estado;
  }

  limpiarTarea(tareaId) {
    let tablonTareaAntiguo = document.getElementById(tareaId).parentElement;
    tablonTareaAntiguo.removeChild(document.getElementById(tareaId));
  }

  moverTarea(tareaId) {
    let tarea = this.tareas[tareaId];
    console.log(tarea);
    console.log(tarea.estado);
    switch (tarea.estado) {
      case "Ready":
        tarea.estado = "Dev";
        break;
      case "Dev":
        tarea.estado = "Test";
        break;
      case "Test":
        tarea.estado = "Done";
        break;
      case "Done":
        tarea.estado = "Done";
        break;
      default:
        tarea.estado = "Done";
        break;
    }
    this.tareas[tareaId] = tarea;
    this.limpiarTarea(tareaId);
    añadirTarea(tarea);
  }

  borrarTareaModal(tareaId) {
    borrarTarea(this.tareas[tareaId]);
  }

  open() {
    const tarea = this.tareas[this.tareaId];
    console.log(tarea);
    let estadoVisible = true;
    if (tarea.estado === "Done") {
      estadoVisible = false;
    }

    const modal = new tingle.modal({
      footer: true,
      stickyFooter: false,
      closeMethods: ["overlay", "button", "escape"],
      closeLabel: "Cerrar",
      cssClass: ["custom-class-1", "custom-class-2"],

      beforeClose: function () {
        return true;
      },
    });

    modal.setContent(`
      <h1>${this.titulo}</h1>
      <p>${this.contenido}</p>
    `);

    if (estadoVisible) {
      console.log(this.estadoVisible);
      modal.addFooterBtn(
        "Avanzar estado",
        "tingle-btn tingle-btn--primary",
        () => {
          this.moverTarea(this.tareaId);
          modal.close();
        }
      );
    }
    modal.addFooterBtn("Borrar tarea", "tingle-btn tingle-btn--primary", () => {
      if (confirm("¿Estás seguro de que quieres borrar la tarea?")) {
        this.borrarTareaModal(this.tareaId);
        modal.close();
      }
    });
    modal.addFooterBtn("Cerrar", "tingle-btn tingle-btn--default", () => {
      modal.close();
    });

    modal.open();
  }
}

export function createModal(title, content, tareaId, tareas) {
  const modal = new Modal(title, content, tareaId, tareas);
  modal.open();
}
