const { contextBridge, ipcRenderer } = require("electron");

function call(channel, ...args) {
  const result = ipcRenderer.sendSync(channel, ...args);
  if (result.error) throw new Error(result.error);
  return result.value;
}

contextBridge.exposeInMainWorld("taskSync", {
  read: () => call("tasks:read"),
  write: (expected, data) => call("tasks:write", expected, data),
});
