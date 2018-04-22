POC about angular-compilers ignoring declarations.d.ts.

Available from [atao60/meteor-angular-no-type-declaration
](https://github.com/atao60/meteor-angular-no-type-declaration).

Used for issue [typescript compiler ignoring *.d.ts files](https://github.com/Urigo/angular-meteor/issues/1909).

Ref. : 
* [Angular-Meteor update to 1.6.1.1 typescript compiler missing declarations](https://stackoverflow.com/questions/49744034/angular-meteor-update-to-1-6-1-1-typescript-compiler-missing-declarations/49821231?noredirect=1#comment86713844_49821231)


* [Migrating to Typescript: Write a declaration file for a third-party NPM module](https://medium.com/@chris_72272/migrating-to-typescript-write-a-declaration-file-for-a-third-party-npm-module-b1f75808ed2), Chris Thompson, Apr 13, 2017

* [Configuring TypeScript compiler](https://blog.angularindepth.com/configuring-typescript-compiler-a84ed8f87e3), Max NgWizard K, Jan 31, 2017


Setup
---

Based on [Angular-Meteor bare example with MeteorCLI](https://github.com/Urigo/angular-meteor/tree/master/examples/MeteorCLI/bare).

With implicit 'any':

```bash
svn export https://github.com/Urigo/angular-meteor/trunk/examples/MeteorCLI/bare meteor-angular-bare
[...]
Exported at revision 4499.

cd meteor-angular-bare

git init
git add --all
git commit -m 'angular-meteor bare example as it'
git remote add origin git@github.com:atao60/meteor-angular-no-type-declaration.git
git push -u origin master

meteor update --release 1.6.1.1
[...]
babel-compiler         upgraded from 7.0.5 to 7.0.6
ecmascript             upgraded from 0.10.5 to 0.10.6
minifier-css           removed from your project
minifier-js            removed from your project
standard-minifier-css  removed from your project
standard-minifier-js   removed from your project

meteor-angular-bare2: updated to Meteor 1.6.1.1.

meteor update --all-packages
[...]
angular-compilers            upgraded from 0.3.1 to 0.3.1_2
angular-html-compiler        upgraded from 0.3.1 to 0.3.1_2
angular-scss-compiler        upgraded from 0.3.1 to 0.3.1_2
angular-typescript-compiler  upgraded from 0.3.1 to 0.3.1_2
babel-compiler               upgraded from 7.0.6 to 7.0.7
ecmascript                   upgraded from 0.10.6 to 0.10.7
http                         upgraded from 1.4.0 to 1.4.1
minimongo                    upgraded from 1.4.3 to 1.4.4
modules                      upgraded from 0.11.5 to 0.11.6
mongo                        upgraded from 1.4.5 to 1.4.7

meteor npm --depth 9999 update --dev
> phantomjs-prebuilt@2.1.16 [...]
> node install.js
[...]
> sinon@4.4.6 [...]
[...]
+ core-js@2.5.5
+ @angular/platform-browser@5.2.10
+ rxjs@5.5.10
+ zone.js@0.8.26
+ meteor-rxjs@0.4.10
+ @angular/core@5.2.10
+ @angular/forms@5.2.10
+ @angular/compiler@5.2.10
+ @angular/common@5.2.10
+ @angular/platform-browser-dynamic@5.2.10
+ @babel/runtime@7.0.0-beta.44
+ @angular/router@5.2.10
+ meteor-node-stubs@0.3.3

git add .
git commit -m 'fully updated'
```

Add a package without type declation:

```bash

meteor npm install --save dir-obj
[...]
+ dir-obj@2.0.1

meteor npm install --save-dev @types/node
[...]
+ @types/node@9.6.6

meteor npm install

sed -i '/^\s*"types"\s*:/ a\
      "@types/node",
' tsconfig.json

cat >server/main.ts<<___EOF
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
___EOF

meteor
[...]
=> App running at: http://localhost:3000/
# no warning or error message

```

Without implicit 'any':

```bash
sed -i '/^\s*"noImplicitAny"/ s/false/true/' tsconfig.json

meteor
[...]
[server]: ES2015 modules Compilation: 645.388ms
server/main.ts (1, 25): Could not find a declaration file for module 'dir-obj'. 'node_modules/dir-obj/index.js' implicitly has an 'any' type.
  Try `npm install @types/dir-obj` if it exists or add a new declaration (.d.ts) file containing `declare module 'dir-obj';`
server/main.ts (12, 24): Parameter 'dirPath' implicitly has an 'any' type.

[...]
=> App running at: http://localhost:3000/

```

With default type declaration:

```bash

cat >declarations.d.ts<<___EOF
declare module '*';
___EOF

sed -i '/^\s*"include"\s*:/ a\
    "declarations.d.ts",
' tsconfig.json

meteor
[...]
[server]: ES2015 modules Compilation: 572.393ms
server/main.ts (1, 25): Could not find a declaration file for module 'dir-obj'. 'node_modules/dir-obj/index.js' implicitly has an 'any' type.
  Try `npm install @types/dir-obj` if it exists or add a new declaration (.d.ts) file containing `declare module 'dir-obj';`
server/main.ts (12, 24): Parameter 'dirPath' implicitly has an 'any' type.

[...]
=> App running at: http://localhost:3000/
```

