#!/usr/bin/env node
const fs = require('fs');

const Reset  = '\x1b[0m';
const Bright = '\x1b[1m';
const Dim = '\x1b[2m';
const Underscore = '\x1b[4m';
const Blink = '\x1b[5m';
const Reverse = '\x1b[7m';
const Hidden = '\x1b[8m';
 
const FgBlack = '\x1b[30m';
const FgRed = '\x1b[31m';
const FgGreen = '\x1b[32m';
const FgYellow = '\x1b[33m';
const FgBlue = '\x1b[34m';
const FgMagenta = '\x1b[35m';
const FgCyan = '\x1b[36m';
const FgWhite = '\x1b[37m';
 
const BgBlack = '\x1b[40m';
const BgRed = '\x1b[41m';
const BgGreen = '\x1b[42m';
const BgYellow = '\x1b[43m';
const BgBlue = '\x1b[44m';
const BgMagenta = '\x1b[45m';
const BgCyan = '\x1b[46m';
const BgWhite = '\x1b[47m';

const sourcePath = `${ __dirname }/source`;



const isDirectory = (directoryPath) => {
  return fs.statSync(directoryPath).isDirectory();
};



const createFilesListSync = (path, filesToCopy = []) => {

  const files = fs.readdirSync(path.from);

  files.forEach((file) => {

    const fileSource = `${ path.from }/${ file }`;
    const fileDestination = fileSource.replace(`${ path.from }/`, path.to);
    
    if (isDirectory(fileSource)) {

      createFilesListSync({
        from: fileSource,
        to: `${ fileDestination }/`,
      }, filesToCopy);

    }

    filesToCopy.push({
      from: fileSource,
      to: fileDestination,
    });
    
  });

  return filesToCopy;

};



const createFilesList = (path) => {

  const filesList = createFilesListSync(path);
  
  return new Promise((resolve) => {
    if (Array.isArray(filesList)) {
      resolve(filesList);
    }
  });

};



const copyFileSync = (file, callback) => {

  fs.copyFile(file.from, file.to, (err) => {
    if (err) console.error(err);
    else {
      console.log(`\t\u2714  ${ file.to }`);

      if (typeof callback === 'function') {
        callback();
      }
    }
  });

}



const copyFile = (file) => {

  return new Promise((resolve) => {
    copyFileSync(file, resolve);
  });

};
