export class Modal {
  constructor(
    title = "Título del Modal",
    content = "Contenido de la tarea",
    elementId = null,
    tareas,
    id
  ) {
    this.title = title;
    this.content = content;
    this.elementId = elementId;
    this.tareas = tareas;
    this.id = id;
  }

  changeButtonText(newText) {
    console.log("Cambiando texto del botón a:", newText);
    this.buttonText = newText;
  }

  cerrar() {
    const modalElement = document.getElementById(this.id);
    if (modalElement) {
      modalElement.remove();
    }
  }

  delete(myModal, elementId) {
    const elementoBorrar = document.getElementById(this.elementId);
    const botonBorrar = document.getElementById("botonBorrar");
    botonBorrar.onclick = () => {
      if (confirm("¿Quieres borrar esta tarea?")) {
        elementoBorrar.remove();
        myModal.hide();
        delete this.tareas[this.elementId];
      }
    };
  }

  changeToDevelopment(myModal, elementId) {
    const changeToDev = document.getElementById("botonDesarrollo");
    const divDesarrollo = document.getElementById("tareasDesarrollo");
    changeToDev.addEventListener("click", () => {
      myModal.hide();
      changeToDev.textContent = "Tarea en desarrollo";
      divDesarrollo.appendChild(document.getElementById(elementId));
    });
  }

  open() {
    const modalId = `modal-${this.elementId}`;

    // Crear el contenedor
    const modalHtml = `
      <div class="modal fade" id=${modalId} tabindex="-1" aria-labelledby="myModalLabel">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="myModalLabel">${this.title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar" onclick=${this.cerrar()}></button>
            </div>
            <div class="modal-body">${this.content}</div>
            <div class="modal-footer">
              <button id="botonBorrar" type="button" class="btn btn-primary">Borrar tarea</button>
              <button type="button" class="btn btn-primary">Reestimar</button>
              <button id="botonDesarrollo" type="button" class="btn btn-primary">Pasar a desarrollo</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Insertar el modal en el body
    document.body.insertAdjacentHTML("beforeend", modalHtml);

    // Inicializar y mostrar el modal con Bootstrap
    const myModal = new bootstrap.Modal(document.getElementById(modalId));
    myModal.show();
    this.changeToDevelopment(myModal, this.elementId);
    this.delete(myModal, this.elementId);
  }
}

export function createModal(title, content, elementId, tareas) {
  const modal = new Modal(title, content, elementId, tareas);
  modal.open();
}
