import * as mkdirp from 'mkdirp';
import * as path from 'path';
import * as pify from 'pify';

const electron = window.require('electron');
const fs = electron.remote.require('fs');

const fileExists = path => pify(fs.exists)(path);
const readFile = path => pify(fs.readFile)(path, 'utf8');
const writeFile = (path, data) => pify(fs.writeFile)(path, data);

export default { readFile, fileExists, writeFile };