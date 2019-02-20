const { app, Menu, ipcMain, ipcRenderer } = require('electron');
const path = require('path');

class MenuBuilder {
  constructor(window) {
    this.window = window;

    ipcMain.on('recent-files', (event, files) => {
      console.log(`Got recent file list with length ${files.length}`);
    });
    ipcMain.on('project-saved', (event, filename) => {
      // TODO: change the title of the main window
      this.window.setTitle(this.getTitle(filename));
    });
  }

  getTitle(filename) {
    return path.basename(filename);
  }

  getTemplate() {
    return [
      {
        label: 'File',
        submenu: [
          {
            label: 'New Project',
            // click: () => ipcMain.emit('new-project', 'woohoo')
            click: () => this.window.webContents.send('new-project')
          },
          {
            label: 'Save',
            // click: () => ipcMain.emit('new-project', 'woohoo')
            click: () => this.window.webContents.send('save-project')
          },
          {
            label: 'Save As...',
            // click: () => ipcMain.emit('new-project', 'woohoo')
            click: () => this.window.webContents.send('save-project-as')
          },
          { role: "toggleDevTools" }
        ]
      }
    ]
  };

  createMenus() {
    console.log("Initializing menus");
    const menu = Menu.buildFromTemplate(this.getTemplate());
    Menu.setApplicationMenu(menu)
  }
}


module.exports = MenuBuilder;

