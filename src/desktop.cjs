const { app, BrowserWindow, dialog } = require("electron");
const path = require("node:path");

let ventana;

function crearVentana() {
  ventana = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 400,
    minHeight: 500,
    title: "TaskManager",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  ventana.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  ventana.webContents.on("will-navigate", (event) => event.preventDefault());
  ventana.on("closed", () => {
    ventana = null;
  });
  return ventana.loadFile(path.join(__dirname, "..", "dist", "index.html"));
}

function mostrarError(error) {
  dialog.showErrorBox("No se pudo iniciar TaskManager", error.message);
  app.quit();
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (ventana) {
      ventana.show();
      if (ventana.isMinimized()) ventana.restore();
      ventana.focus();
    }
  });

  app.whenReady().then(crearVentana).catch(mostrarError);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) crearVentana().catch(mostrarError);
    else if (ventana) ventana.show();
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
}
