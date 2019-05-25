const MenuBuilder = require("./MenuBuilder");
const electron = require("electron");
const { autoUpdater } = require("electron-updater");
const windowStateKeeper = require("electron-window-state");
const log = require("electron-log");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;
let mainWindowState;
let menuBuilder;

const DEFAULT_WINDOW_STATE = {
  defaultWidth: 1000,
  defaultHeight: 800
};

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
  if (!menuBuilder) {
    menuBuilder = new MenuBuilder(mainWindow).createMenus();
  } else {
    menuBuilder.setWindow(mainWindow);
  }
};

const checkForUpdates = () => {
  log.transports.file.level = "debug";
  autoUpdater.logger = log;
  log.info(`checkForUpdates(): Running version ${app.getVersion()}`);
  autoUpdater.checkForUpdates();
  // autoUpdater.checkForUpdatesAndNotify();
};

app.on("ready", () => {
  createWindow();
  createMenu();
  checkForUpdates();
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
