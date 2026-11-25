const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("node:path");
const documents = require("./lib/sync-documents.cjs");

let ventana;

function documentPath() {
  if (!process.env.LOCALAPPDATA) throw new Error("No se encontró la carpeta de datos locales.");
  return path.join(process.env.LOCALAPPDATA, "WorkPanel", "sync-documents.sqlite3");
}

for (const [channel, operation] of [
  ["tasks:read", () => documents.read(documentPath(), "tasks")],
  ["tasks:write", (expected, data) => documents.write(documentPath(), "tasks", expected, data)],
]) {
  ipcMain.on(channel, (event, ...args) => {
    try {
      if (!ventana || event.sender !== ventana.webContents) throw new Error("Solicitud no autorizada.");
      event.returnValue = { value: operation(...args) };
    } catch (error) {
      event.returnValue = { error: String(error) };
    }
  });
}

function crearVentana() {
  ventana = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 400,
    minHeight: 500,
    title: "TaskManager",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
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
