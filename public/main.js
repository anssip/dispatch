const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const isDev = require("electron-is-dev");
const MenuBuilder = require("../src/controller/MenuBuilder");

let mainWindow;

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
    false
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));
};

const createMenu = () => {
  new MenuBuilder(mainWindow).createMenus();
};

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
