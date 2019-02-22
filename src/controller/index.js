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

    ipcRenderer.on('open-project', async (event, filename) => {
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

  askFile() {
    const filename =  remote.dialog.showSaveDialog(remote.getCurrentWindow(), { title: 'New Project' });
    console.log(`Selected filename ${filename}`);
    return filename;
  }

  async askFileAndSaveProject(event) {
    const filename =  this.askFile();
    if (filename) {
      try {
        const recentFiles = await this.projectContainer.saveProject(filename);
        event.sender.send("recent-files", { filename, recentFiles });
      } catch (err) {
        console.error(err);
      }
      console.log("sending back saved filename");
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