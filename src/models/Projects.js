/*
  This module is reponsible for persisting data to the disk.
*/

// const pify = require('pify');

import * as mkdirp from 'mkdirp';
import * as path from 'path';
import * as pify from 'pify';

const electron = window.require('electron');
const fs = electron.remote.require('fs');

class Projects {
  async load(path) {
    console.log(`loading project file ${path} ${fs.readFile}`);
    const contents = await pify(fs.readFile)(path, 'utf8');
    const data = JSON.parse(contents);
    return {
      requests: data.requests.map(r => ({ ...r, body: JSON.stringify(r.body) })),
      context: JSON.stringify(data.context)
    }
  }

}

const projects = new Projects();

export { projects as projects };
// module.exports = projects;