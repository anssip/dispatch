const { app, Menu, ipcMain, ipcRenderer } = require('electron');
const path = require('path');

class MenuBuilder {
  constructor(window) {
    this.window = window;

    ipcMain.on('recent-files', (event, files) => {
      console.log(`Got recent file list with length ${files.length}`);
      this.createMenus(files);
    });
    ipcMain.on('project-saved', (event, filename) => {
      // TODO: change the title of the main window
      this.window.setTitle(this.getTitle(filename));
    });
  }

  getTitle(filename) {
    return path.basename(filename);
  }

  getTemplate(recentFiles = []) {
    const recentFilesItem = recentFiles.length > 0 ?
      { 
        label: "Open Recent",
        submenu: recentFiles.map(f => ({ label: f, click: () => console.log(`clicked ${f}`)  }))
      } : null;

    const newProjectItem = {
      label: 'New Project',
      // click: () => ipcMain.emit('new-project', 'woohoo')
      click: () => this.window.webContents.send('new-project')
    };
    const restItems = [
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
    ];
    const items = recentFilesItem ? [ newProjectItem, recentFilesItem, ...restItems ] : [ newProjectItem, ...restItems ] ;
    return [ { label: 'File', submenu: items } ] 
  };

  createMenus(files) {
    console.log("Initializing menus");
    const menu = Menu.buildFromTemplate(this.getTemplate(files));
    Menu.setApplicationMenu(menu)
  }
}


module.exports = MenuBuilder;

