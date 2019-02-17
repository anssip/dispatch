const pify = require('pify');

const electron = typeof window !== 'undefined' ?  window.require('electron') : require('electron');
const fs = typeof electron.remote !== 'undefined' ? electron.remote.require('fs') : require('fs');

// TODO: use Ramda to simplify following:
const fileExists = async path => {
  try {
    console.log(`checing existence of path ${JSON.stringify(path)}`);
    const result = await pify(fs.stat)(path);
    console.log(`got file stats ${JSON.stringify(result)}`);
    return result;

  } catch (e) {
    return false;
  }
} 
const readFile = path => {
  console.log(`About to read file ${path}`);
  return pify(fs.readFile)(path, 'utf8');
}
const writeFile = (path, data) => pify(fs.writeFile)(path, data);
const mkdir = path => {
  console.log(`attempting to create dir ${path}`);
  return pify(fs.mkdir)(path);
};

export default { readFile, fileExists, writeFile, mkdir };