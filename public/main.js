const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const isDev = require("electron-is-dev");
const menu = require("../src/controller/menu");

let mainWindow;

electron.ipcMain.on('recent-files', (event, files) => {
  console.log(`Got recent file list with length ${files.length}`);
  throw Error(`Got recent file list with length ${files.length}`);
});  

// @ts-ignore
require("update-electron-app")({
  repo: "kitze/react-electron-example",
  updateInterval: "1 hour"
});

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 900, 
    height: 680
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));
}

const createMenu = () => {
  menu.createMenus(mainWindow);
}

app.on("ready", () => {
  createWindow();
  createMenu();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
    createMenu();
  }
});
