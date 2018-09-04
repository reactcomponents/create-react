#!/usr/bin/env node
const fs = require('fs');
const readline = require('readline');

const ClearScreen = '\x1b[2J';
const Reset  = '\x1b[0m';
const MoveCursorTopLeft = '\033[H';

const Bright = '\x1b[1m';
const Dim = '\x1b[2m';
const Underscore = '\x1b[4m';
const Blink = '\x1b[5m';
const Reverse = '\x1b[7m';
const Hidden = '\x1b[8m';

const FgBlack = '\x1b[30m';
const FgRed = '\x1b[31m';
const FgGreen = '\x1b[32m';
const FgLightGreen = '\x1b[92m';
const FgYellow = '\x1b[33m';
const FgBlue = '\x1b[34m';
const FgMagenta = '\x1b[35m';
const FgLightMagenta = '\x1b[95m';
const FgCyan = '\x1b[36m';
const FgWhite = '\x1b[37m';

const BgBlack = '\x1b[40m';
const BgDarkGray = '\x1b[100m';
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



const getUserInput = (textPrompt, choicesRegEx) => {

  return new Promise((resolve, reject) => {
    
    const prompt = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    prompt.question(textPrompt, (userInput) => {
      if (choicesRegEx) {
        if (choicesRegEx.test(userInput)) {
          resolve(userInput);
        } else {
          reject(userInput);
        }
      } else {
        resolve(userInput);
      }
      console.log('\n');
      prompt.close();
    });
    
  });

};



const yesno = (textPrompt) => {

  const regex = new RegExp(/^(y|yes)$/gi);

  return getUserInput(`${ textPrompt } ${ Dim }[y/n] \n> ${ Reset }`, regex);

};




const createFilesListSync = (path, filesToCopy = [], foldersToMake = []) => {

  const files = fs.readdirSync(path.from);

  files.forEach((file) => {

    const fileSource = `${ path.from }/${ file }`;
    const fileDestination = fileSource.replace(`${ path.from }/`, path.to);
    
    if (isDirectory(fileSource)) {

      createFilesListSync({
        from: fileSource,
        to: `${ fileDestination }/`,
      }, filesToCopy, foldersToMake);

      foldersToMake.push(fileDestination);

    } else {

      filesToCopy.push({
        from: fileSource,
        to: fileDestination,
      });
    
    }
    
  });

  return {
    filesToCopy,
    foldersToMake,
  };

};



const createFilesList = (path) => {
  
  return new Promise((resolve) => {
    const list = createFilesListSync(path);
    if (Array.isArray(list.filesToCopy) && Array.isArray(list.foldersToMake)) {
      resolve(list);
    }
  });

};



const copyFileSync = (file, callback) => {

  fs.copyFile(file.from, file.to, (err) => {
    if (err) console.error(err);
    else {
      if (typeof callback === 'function') {
        callback();
      }
    }
  });

};



const copyFile = (file) => {

  return new Promise((resolve) => {
    copyFileSync(file, () => {
      setTimeout(resolve, 100);
    });
  });

};



const makeDirectorySync = (path, callback) => {

  fs.mkdir(path, (err) => {
    if (err) console.log(err);
    else {
      if (typeof callback === 'function') {
        callback();
      }
    }
  });

};



const makeDirectory = (path) => {

  return new Promise((resolve) => {
    makeDirectorySync(path, () => {
      setTimeout(resolve, 100);
    });
  });

};



const makeDirectoriesSync = (foldersToMake, callback) => {
  
  foldersToMake.sort((a, b) => {
    return a.split('/').length - b.split('/').length;
  });
  
  const recur = async (folders) => {

    if (folders.length === 0) {
      if (typeof callback === 'function') {
        callback();
      }
      return true;
    }

    const folder = folders.shift();

    await makeDirectory(folder);

    return recur(folders);
    
  };

  return recur(foldersToMake);

};



const makeDirectories = (folders) => {

  return new Promise((resolve) => {
    makeDirectoriesSync(folders, resolve);
  });

};



const copyAllFilesSync = async (options, callback) => {
  if (!options) return undefined;
  if (options.from === undefined || options.to === undefined) return undefined;

  console.log(`  ${ FgLightGreen }\u2714${ Reset }  ${ FgLightGreen }${ options.title || '' }${ Reset }`);

  const {
    filesToCopy,
    foldersToMake,
  } = await createFilesList(options);

  await makeDirectories(foldersToMake);

  const recur = async (filesList) => {
    
    if (filesList.length === 0) {
      console.log('');
      if (typeof callback === 'function') {
        callback();
      }
      return true;
    }

    const file = filesList.shift();

    console.log(`    -  ${ file.to }`);

    await copyFile(file);

    console.log(`\x1b[1A\x1b[K     ${ FgCyan }\u2714${ Reset }  ${ FgWhite }${ file.to }${ Reset }`);

    return recur(filesList);
  };

  return recur(filesToCopy);

};



const copyAllFiles = (options) => {
  
  return new Promise((resolve) => {
    copyAllFilesSync(options, resolve);
  });
  
};






console.log(ClearScreen);
console.log(MoveCursorTopLeft);

console.log(`${ FgCyan }${ Bright }CREATE-REACT${ Reset }`);
console.log(`${ Dim }~~~~~~~~~~~~${ Reset }\n`);

yesno('Do you want to continue?')
  .then((input) => {

    copyAllFiles({
      from: sourcePath,
      to: '',
      title: 'Essentials',
    })
    .then(() => {
    
      copyAllFiles({
        from: `${ __dirname }/prebuilt/router`,
        to: 'src/',
        title: 'Router',
      });
    
    })
    .catch(() => {});

  })
  .catch((err) => {
    console.log(`\n${ BgMagenta } EXITED ${ Reset }`);
  });
