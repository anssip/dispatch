const { ipcRenderer, remote } = window.require('electron');


class ApplicationController {
  constructor(projectContainer) {
    this.projectContainer = projectContainer;

    ipcRenderer.on('save-project', async event => {
      await this.saveActive();
      event.sender.send("recent-files", { recentFiles: this.projectContainer.getFiles() });
    });

    ipcRenderer.on('save-project-as', event => {
      this.askFileAndSaveProject(event);
    });

    ipcRenderer.on('new-project', event => {
      this.projectContainer.newProject();
    });

    ipcRenderer.on('open-project', event => {
      this.openProject(event);
    });

    ipcRenderer.on('open-recent', async (event, filename) => {
      console.log('ApplicationController: open-project');
      const recentFiles = await this.projectContainer.openProject(filename);
      if (recentFiles) {
        console.log(`sending recent files ${recentFiles}`);
        event.sender.send("recent-files", { filename, recentFiles });
      } else {
        // TODO: dispatch error and handle it in the MainWindow and show an error flash
      }
    });
  }

  showOpenDialog() {
    return remote.dialog.showOpenDialog(remote.getCurrentWindow(), { title: 'Open Project' });
  }

  showSaveDialog() {
    return remote.dialog.showSaveDialog(remote.getCurrentWindow(), { title: 'New Project' });
  }

  async askFileAndSaveProject(event) {
    const filename =  this.showSaveDialog();
    if (filename) {
      try {
        const recentFiles = await this.projectContainer.saveProject(filename);
        event.sender.send("recent-files", { filename, recentFiles });
      } catch (err) {
        console.error(err);
      }
    }
  }

  async openProject(event) {
    const filenames =  this.showOpenDialog();
    console.log(`Opened file ${filenames}`);
    if (filenames && filenames.length >= 0) {
      try {
        const recentFiles = await this.projectContainer.openProject(filenames[0]);
        event.sender.send("recent-files", { filename: filenames[0], recentFiles });
      } catch (err) {
        console.error(err);
      }
    }
  }

  saveActive() {
    const active = this.projectContainer.getActive();
    if (! active) {
      this.askFileAndSaveProject();
    } else {
      this.projectContainer.saveActiveProject();
    }
  }
}

export default ApplicationController;