const pify = require('pify');

let fs;

const setFs = value => fs = value;
const getFs = () => {
  if (fs) return fs;
  const electron = window.require('electron');
  fs = electron.remote.require('fs');
  return fs;
}

// TODO: use Ramda to simplify following:
const fileExists = async path => {
  try {
    console.log(`checing existence of path ${JSON.stringify(path)}`);
    const result = await pify(getFs().stat)(path);
    console.log(`got file stats ${JSON.stringify(result)}`);
    return result;

  } catch (e) {
    return false;
  }
} 
const readFile = path => {
  console.log(`About to read file ${path}`);
  return pify(getFs().readFile)(path, 'utf8');
}
const writeFile = (path, data) => pify(getFs().writeFile)(path, data);

const mkdir = path => {
  console.log(`attempting to create dir ${path}`);
  return pify(getFs().mkdir)(path);
};
const unlink = async path => {
  try {
    await pify(getFs().unlink)(path);
  } catch(e) {
    console.error(e);
  }
}

export default { setFs, readFile, fileExists, writeFile, mkdir, unlink };