const { ipcRenderer, remote } = window.require('electron');


class ApplicationController {
  constructor(projectContainer) {
    this.projectContainer = projectContainer;

    ipcRenderer.on('save-project', () => {
      this.saveActive();
    });

    ipcRenderer.on('save-project-as', event => {
      this.askFileAndSaveProject(event);
    });

    ipcRenderer.on('new-project', () => {
      this.projectContainer.newProject();
    });

    ipcRenderer.on('open-project', (event, filename) => {
      const opened = this.projectContainer.openProject(filename);
      if (opened) {
        event.sender.send("recent-files", { filename, recentFiles: this.projectContainer.getFiles() });
      } else {
        // TODO: dispatch error and handle it in the MainWindow and show an error flash
      }
    });
  }

  askFile() {
    const filename =  remote.dialog.showSaveDialog(remote.getCurrentWindow(), { title: 'New Project' });
    console.log(`Selected filename ${filename}`);
    return filename;
  }

  async askFileAndSaveProject(event) {
    const filename =  this.askFile();
    if (filename) {
      try {
        await this.projectContainer.saveProject(filename);
      } catch (err) {
        console.error(err);
      }
      console.log("sending back saved filename");
      event.sender.send("recent-files", { filename, recentFiles: this.projectContainer.getFiles() });
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