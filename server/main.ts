import * as dirObj from 'dir-obj';
import * as path from 'path';

import './imports/methods/todos';
import './imports/publications/todos'

const client = readDirectory('client');

console.log("client sub folder");
console.log(JSON.stringify(client, null, 2));

function readDirectory(dirPath) {
    const fullDirPath = path.join(process.env.PWD, dirPath);
    const dirContent = dirObj.readDirectory(fullDirPath, {
        fileTransform: (file: any/*dirObj.File*/) => {
          return file.fullpath;
        }
    });
    return dirContent;
}
