'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const Menu = electron.Menu;

//require('crash-reporter').start();
var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

app.on('ready', function() {

  // ブラウザ(Chromium)の起動, 初期画面のロード
  mainWindow = new BrowserWindow({width: 800, height: 800});
  mainWindow.loadURL('file://' + __dirname + '/../index.html');
  mainWindow.toggleDevTools();

  installMenu();

  var f = require('./fuck.js');
  console.log (f.fuck());

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

// http://qiita.com/okaxaki/items/8b8942b0c4e13ac67739
function installMenu() {
  // TODO if,elseまとめる
  if (process.platform == 'darwin') {
    var menu = Menu.buildFromTemplate([
      {
        label: 'Electron',
        submenu: [
          {
            label: 'Quit',
            accelerator: 'Command+Q',
            click: function() { app.quit(); }
          },
        ]
      },
      {
        label: 'AnsibleEditor',
        submenu: [
          {
            label: 'load Folder',
            click: function(item, focusedWindow) {
              mainWindow.webContents.send("ping");
            }
          },
        ]
      }
    ]);
    Menu.setApplicationMenu(menu);
  } else {
    var menu = Menu.buildFromTemplate([
      {
        label: '&AnsibleEditor',
        submenu: [
          {
            label: '&AnsibleEditor',
            click: function() {
              mainWindow.webContents.send("ping");
            }
          },
        ]
      }
    ]);
    mainWindow.setMenu(menu);
  }
}
