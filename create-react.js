#!/usr/bin/env node
const fs = require('fs');

const { copyAllFiles } = require('@willsquad/fs-utilities');

const { yesno } = require('user-input-cli-test');
const MultipleChoice = require('multiple-choice-cli-test');

const ClearScreen = '\x1b[2J';
const Reset  = '\x1b[0m';
const MoveCursorTopLeft = '\033[H';
const Bright = '\x1b[1m';
const Dim = '\x1b[2m';
const FgCyan = '\x1b[36m';
const FgWhite = '\x1b[37m';
const BgRed = '\x1b[41m';
const BgCyan = '\x1b[46m';

const sourcePath = `${ __dirname }/source`;



const runInOrder = (fn, arguments = []) => {

  return new Promise((resolve, reject) => {

    const recur = () => {
      
      const thisArgument = arguments.shift();

      const continueRun = () => {

        if (arguments.length > 0) {
          recur();
        } else {
          resolve();
        }

      };

      const fnReturned = fn(thisArgument);

      if (fnReturned instanceof Promise) {

        fnReturned
          .then(continueRun)
          .catch((err) => reject(err));

      } else {

        continueRun();

      }

    };

    recur();

  });

};


console.log(ClearScreen);
console.log(MoveCursorTopLeft);

console.log(`${ FgCyan }${ Bright }CREATE-REACT${ Reset }`);
console.log(`${ Dim }~~~~~~~~~~~~${ Reset }\n`);

yesno('Do you want to continue?')
  .then((input) => {
  
    const options = [
      'Apple',
      'Orange',
      'Grapes',
      'Strawberry',
      'Banana',
    ];
    
    const mc = new MultipleChoice(options);
    
    mc.prompt('What is your favorite fruit?')
      .then((res) => {
        
        const copyOrder = [
          {
            from: `${ sourcePath }/react/core`,
            to: '',
            title: 'Essentials',
          },
          {
            from: `${ __dirname }/prebuilt/router`,
            to: 'src/',
            title: 'Router',
          }
        ];
    
        runInOrder(copyAllFiles, copyOrder)
          .then(() => {
            console.log(`\n${ BgCyan }${ FgWhite }${ Bright } DONE ${ Reset }`);
          });

      });

  })
  .catch((err) => {
    console.log(`\n${ BgRed } EXITED ${ Reset }`);
  });
