const { app, Menu, ipcMain } = require('electron');

const getTemplate = win => [
  {
    label: 'File',
    submenu: [
      { 
        label: 'New Project...',
        // click: () => ipcMain.emit('new-project', 'woohoo')
        click: () => win.webContents.send('new-project', 'woohoo')
     },
     { role: "toggleDevTools" }
    ]
  }
];

const createMenus = (win) => {
  console.log("Initializing menus");
  const menu = Menu.buildFromTemplate(getTemplate(win));
  Menu.setApplicationMenu(menu)
} 

module.exports = {
  createMenus
};