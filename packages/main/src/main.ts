import { app } from 'electron';
import path from 'path';
import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import windowStateKeeper from 'electron-window-state';
import isDev from '@/libs/isDev';
import { commonConfig } from '@react-electron-admin/scripts/configs';

import('@/core/message');
const { port, host, html } = commonConfig.renderer;

let win: BrowserWindow | null;

const appLock = app.requestSingleInstanceLock();

if (!appLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (win) {
      if (win.isMinimized()) {
        win.restore();
      }
      win.focus();
    }
  });
}

function getWindowUrl(): string {
  if (true) { //isDev()
    return `http://${host}:${port}#`;
  } else {
    //TODO
    return `file://${html}#`;
  }
}

async function createWindow() {
  console.log(getWindowUrl());
  let main_window_state = windowStateKeeper({
    defaultWidth: 1050 + (isDev() ? 300 : 0),
    defaultHeight: 700,
  });

  const windowOptions: BrowserWindowConstructorOptions = {
    minWidth: 1050 + (isDev() ? 300 : 0),
    minHeight: 700,
    width: main_window_state.width,
    height: main_window_state.height,
    show: false,
    hasShadow: true,
    webPreferences: {
      contextIsolation: true,
      spellcheck: true,
      //preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'hidden',
    frame: false,
  };
  win = new BrowserWindow(windowOptions);
  if (!isDev()) {
    // 开发环境不keep window state
    main_window_state.manage(win);
  }

  global.main_win = win;

  const url = getWindowUrl();
  console.log(url);
  win.loadURL(url).catch((e) => console.error(e));

  if (isDev()) {
    win.webContents.once('dom-ready', () => {
      win!.webContents.openDevTools();
    });
  }

  win.webContents.on('did-finish-load', () => {
    win!.show();
  });
  win.on('close', (e: Electron.Event) => {
    if (global.is_will_quit) {
      win = null;
    } else {
      e.preventDefault();
      win?.hide();
    }
  });
  win.on('closed', () => {
    win = null;
  });

  return win;
}

app.on('ready', async () => {
  await createWindow();
});

const onActive = async () => {
  if (win === null) {
    await createWindow();
  } else if (win.isMinimized()) {
    await win.restore();
  }
  win?.show();
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => (global.is_will_quit = true));
app.on('activate', onActive);
