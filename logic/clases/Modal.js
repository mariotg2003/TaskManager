export class Modal {
  constructor(
    title = "Título del Modal",
    content = "Contenido de la tarea",
    id = "myModal"
  ) {
    this.title = title;
    this.content = content;
    this.id = id;
  }

  close() {
    const modalElement = document.getElementById(this.id);
    if (modalElement) {
      modalElement.remove();
    }
  }

  open() {
    // Crear el contenedor del modal
    const modalHtml = `
      <div class="modal fade" id="myModal" tabindex="-1" aria-labelledby="myModalLabel">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="myModalLabel">${this.title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar" onclick=${this.close()}></button>
            </div>
            <div class="modal-body">${this.content}</div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary">Borrar tarea</button>
              <button type="button" class="btn btn-primary">Reestimar</button>
              <button type="button" class="btn btn-primary">Cambiar a desarrollo</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Insertar el modal en el body
    document.body.insertAdjacentHTML("beforeend", modalHtml);

    // Inicializar y mostrar el modal con Bootstrap
    const myModal = new bootstrap.Modal(document.getElementById("myModal"));
    myModal.show();
  }
}

export function createModal(title, content) {
  const modal = new Modal(title, content);
  modal.open();
}
