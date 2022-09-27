/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, session } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import {
  getProjectsFileName,
  getStartShellArguments,
  resolveHtmlPath,
} from './util';
import fs from 'fs';
import { ChildProcess } from 'child_process';
import { configureStore } from '@reduxjs/toolkit';
import reducer from './store/configureStore';
import _shell from 'shelljs';
import os from 'os';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let splashScreen: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

export const store = configureStore({
  reducer,
});

// export const shells: ChildProcess[] = []

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1280,
    height: 800,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      sandbox: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
    resizable: false,
  });

  splashScreen = new BrowserWindow({
    show: false,
    width: 500,
    height: 300,
    transparent: false,
    frame: false,
    alwaysOnTop: false, // true
    resizable: false,
    webPreferences: {
      sandbox: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  splashScreen.loadURL(resolveHtmlPath('index.html', true));
  mainWindow.loadURL(resolveHtmlPath('index.html', false));

  splashScreen && splashScreen.on("ready-to-show", () => {
    if(!splashScreen) throw new Error('"splashScreen" is not defined');
    if(process.env.START_MINIMIZED) {
      splashScreen.minimize()
    } else {
      splashScreen.show()
    }
  })

  mainWindow &&
    mainWindow.on('ready-to-show', () => {
      if (!mainWindow) throw new Error('"mainWindow" is not defined');
      if (process.env.START_MINIMIZED) {
        mainWindow.minimize();
      } else {
        setTimeout(() => {
          splashScreen && splashScreen.hide();
          if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
          }
        }, 1500);
      }
    });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

ipcMain.handle('import-project', async (_e, arg) => {
  // qui handlo l'import del progetto
  fs.appendFile(
    app.getPath('documents') + getProjectsFileName(),
    arg[0],
    (err) => {
      if (err) alert(err);
    }
  );
  return 'ok';
});

ipcMain.handle('get-projects', async (e, _arg) => {
  e.preventDefault();
  const projectFileDir = app.getPath('documents') + getProjectsFileName();

  if (fs.existsSync(projectFileDir))
    return fs.readFileSync(projectFileDir, 'utf8');
  else return '';
});

ipcMain.handle('remove-project', async (_, arg) => {
  const projectFileDir = app.getPath('documents') + getProjectsFileName();
  const composed = `${arg[0].dir}:::${arg[0].commands}`;

  if (fs.existsSync(projectFileDir)) {
    const projects = fs.readFileSync(projectFileDir, 'utf8').split('---');
    const newProjects = projects.filter((p) => p !== composed).join('---');
    fs.writeFileSync(projectFileDir, newProjects);
    return 'done';
  }

  return 'Qualcosa è andato storto, in realtà non dovresti mai vedere questo messaggio, ma evidentemente hai cancellato il file projects.txt';
});

let runningShells: { process: ChildProcess; projectName: string }[] = [];

ipcMain.handle('start-shell', async (e, arg) => {
  e.preventDefault();

  const { commands, dir, projectName } = getStartShellArguments(arg);
  
  const isWindows = process.platform === 'win32';
  const env = !isWindows
    ? { ...process.env, ...{ PATH: process.env.PATH + ':/usr/local/bin' } }
    : { ...process.env };

  const shell = _shell
    .cd(dir)
    .exec(commands, { async: true, env }, (code, _stdout, stderr) => {
      console.log('Exit code:', code);
      console.log('Program stderr:', stderr);
    });

  mainWindow && mainWindow.webContents.send('shell-created', projectName);

  runningShells.push({ process: shell, projectName });

  if (shell.stdout) {
    shell.stdout.on('data', (data) => {
      mainWindow &&
        mainWindow.webContents.send('shell-output', {
          terminalData: data,
          projectName,
        });
    });
    shell.stdout.on('close', () => console.log('Shell killata'));
  }

  return {
    message: 'ok',
    projectName,
  };
});

// runningShells.forEach(({ process, projectName }) => {
//   if(process.stdout) {
//     process.stdout.on('data', (data) => {
//       console.log("EXTERNAL PROCESS DATA", typeof data)
//       mainWindow &&
//         mainWindow.webContents.send('shell-output', {
//           terminalData: data,
//           projectName,
//         });
//     });
//   }
// })

ipcMain.handle('kill-shell', (_e, arg) => {
  const name = arg[0];

  const found = runningShells.findIndex((shell) => shell.projectName === name);

  if (found !== -1) {
    runningShells[found].process.kill();
  }

  // deletes the killed shell from the array
  runningShells = runningShells.filter((s) => s.projectName !== name);

  return {
    message: 'ok',
    length: runningShells.length,
  };
});

ipcMain.handle('open-github', () => {
  shell.openExternal('https://github.com/deltasolutionsita/topa3');
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(async () => {
    const reduxDevToolsPath = path.join(
      os.homedir(),
      'Library/Application Support/Google/Chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/3.0.11_0'
    );
    await session.defaultSession.loadExtension(reduxDevToolsPath);
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
