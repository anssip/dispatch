const { app, Menu, ipcMain, ipcRenderer } = require("electron");
const path = require("path");

class MenuBuilder {
  constructor(window) {
    this.window = window;

    ipcMain.on("recent-files", (event, data) => {
      console.log("MenuBuilder recent-files");
      if (data.filename) {
        try {
          this.window.setTitle(this.getTitle(data.filename));
        } catch (e) {
          console.error(e);
        }
      }
      if (data.recentFiles && data.recentFiles.length > 0) {
        this.createMenus(data.recentFiles);
      }
    });
  }

  setWindow(window) {
    this.window = window;
  }

  getTitle(filename) {
    return path.basename(filename);
  }

  getTemplate(recentFiles = []) {
    const recentFilesItem =
      recentFiles.length > 0
        ? {
            label: "Open Recent",
            submenu: recentFiles.map(f => ({
              label: f,
              click: () => this.window.webContents.send("open-recent", f)
            }))
          }
        : null;

    const firstItems = [
      {
        label: "New Project",
        accelerator: "CommandOrControl+N",
        click: () => this.window.webContents.send("new-project")
      },
      {
        label: "Open...",
        accelerator: "CommandOrControl+O",
        click: () => this.window.webContents.send("open-project")
      }
    ];
    const restItems = [
      { type: "separator" },
      {
        label: "Save",
        accelerator: "CommandOrControl+S",
        click: () => this.window.webContents.send("save-project")
      },
      {
        label: "Save As...",
        accelerator: "CommandOrControl+Shift+S",
        click: () => this.window.webContents.send("save-project-as")
      },
      { type: "separator" },
      {
        label: "Close Project",
        accelerator: "CommandOrControl+W",
        click: () => this.window.webContents.send("close-project")
      },
      { role: "toggleDevTools" }
    ];
    const items = recentFilesItem
      ? [...firstItems, recentFilesItem, ...restItems]
      : [...firstItems, ...restItems];
    return [
      { label: "File", submenu: items },
      {
        label: "Edit",
        submenu: [
          { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
          {
            label: "Redo",
            accelerator: "Shift+CmdOrCtrl+Z",
            selector: "redo:"
          },
          { type: "separator" },
          { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
          { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
          { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
          {
            label: "Select All",
            accelerator: "CmdOrCtrl+A",
            selector: "selectAll:"
          }
        ]
      }
    ];
  }

  createMenus(files) {
    console.log(`Initializing menus. Recent files ${JSON.stringify(files)}`);
    const menu = Menu.buildFromTemplate(this.getTemplate(files));
    Menu.setApplicationMenu(menu);
  }
}

module.exports = MenuBuilder;
