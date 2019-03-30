const electron = require("electron");
const windowStateKeeper = require("electron-window-state");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const isDev = require("electron-is-dev");
const MenuBuilder = require("../src/services/MenuBuilder");

let mainWindow;
let mainWindowState;

const DEFAULT_WINDOW_STATE = {
  defaultWidth: 1000,
  defaultHeight: 800
};
// @ts-ignore
require("update-electron-app")({
  repo: "kitze/react-electron-example",
  updateInterval: "1 hour"
});

const createWindow = () => {
  mainWindowState = windowStateKeeper(DEFAULT_WINDOW_STATE);
  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height
  });
  mainWindowState.manage(mainWindow);

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => {
    mainWindowState.saveState(mainWindow);
    mainWindow = null;
  });
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
