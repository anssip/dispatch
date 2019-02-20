const { ipcRenderer, remote } = window.require('electron');


class ApplicationController {
  constructor(projectContainer) {
    this.projectContainer = projectContainer;

    ipcRenderer.on('new-project', () => {
      const filename =  remote.dialog.showSaveDialog(remote.getCurrentWindow(), { title: 'New Project' });
      console.log(`Selected filename ${filename}`);
    });
  }
}

export default ApplicationController;