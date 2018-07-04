'use strict';

var path = require('path')
var electron = require('electron');
var BrowserWindow = electron.BrowserWindow;
const {app} = require('electron');

var window = null;


app.on('ready', function() {

  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
  
  window = new BrowserWindow({
    width: width,
    height: height,
    resizable: false,
    frame: false,
    transparent: false,
    show: true,
    kiosk: true
  });

  const appPath = path.join(__dirname, 'www', 'index.html');

  window.loadURL('file://' + appPath);

  //window.loadURL('http://localhost:8100');

  window.on('close', function () {
    window = null;
  });

  window.on('blur', function(){
    window.hide();
  });
});
