const { app, Menu, ipcMain, ipcRenderer } = require('electron');
const path = require('path');

class MenuBuilder {
  constructor(window) {
    this.window = window;

    ipcMain.on('recent-files', (event, data) => {
      console.log("MenuBuilder recent-files");
      if (data.filename) {
        this.window.setTitle(this.getTitle(data.filename));
      }
      if (data.recentFiles && data.recentFiles.length > 0) {
        this.createMenus(data.recentFiles);
      }
    });
  }

  getTitle(filename) {
    return path.basename(filename);
  }

  getTemplate(recentFiles = []) {
    const recentFilesItem = recentFiles.length > 0 ?
      { 
        label: "Open Recent",
        submenu: recentFiles.map(f => ({ label: f, click: () => this.window.webContents.send('open-project', f) }))
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
    console.log(`Initializing menus. Recent files ${JSON.stringify(files)}`);
    const menu = Menu.buildFromTemplate(this.getTemplate(files));
    Menu.setApplicationMenu(menu)
  }
}


module.exports = MenuBuilder;

