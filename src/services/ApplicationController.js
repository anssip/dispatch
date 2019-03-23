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
      this.newProject();
    });

    ipcRenderer.on('open-project', event => {
      this.openProject(event);
    });

    ipcRenderer.on('open-recent', async (event, filename) => {
      console.log(`ApplicationController: open-project ${projectContainer.isModified()}`);
      if (! await this.saveCurrentChanges()) return;

      const recentFiles = await this.projectContainer.open(filename);
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

  async saveCurrentChanges() {
    if (this.projectContainer.isModified()) {
      const btnClicked = remote.dialog.showMessageBox(remote.getCurrentWindow(), 
      { 
        type: 'question',
        message: 'Do you want to save the changes you made to the current project?',
        detail: 'Your changes will be lost if you don\'t save them.',
        buttons: ['Don\'t Save', 'Cancel', 'Save' ],
        defaultId: 2,
        normalizeAccessKeys: true,
        title: 'Save Changes' 
      });
      if (btnClicked == 1) return false; // Cancel
      if (btnClicked == 2) {
        await this.projectContainer.saveActiveProject();
      }      
    } 
    return true;
  }

  async newProject() {    
    if (! await this.saveCurrentChanges()) return;
    this.projectContainer.newProject();
  }

  async askFileAndSaveProject(event) {
    const filename =  this.showSaveDialog();
    if (filename) {
      try {
        const recentFiles = await this.projectContainer.save(filename);
        event.sender.send("recent-files", { filename, recentFiles });
      } catch (err) {
        console.error(err);
      }
    }
  }

  async openProject(event) {
    if (! await this.saveCurrentChanges()) return;
    const filenames =  this.showOpenDialog();
    console.log(`Opened file ${filenames}`);
    if (filenames && filenames.length >= 0) {
      try {
        const recentFiles = await this.projectContainer.open(filenames[0]);
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