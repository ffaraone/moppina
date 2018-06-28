'use strict';

var path = require('path')
var electron = require('electron');
var BrowserWindow = electron.BrowserWindow;
const {app} = require('electron');

var window = null;

const WINDOW_WIDTH = 800;
const WINDOW_HEIGHT = 480;


app.on('ready', function() {
  
  window = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    resizable: false,
    frame: false,
    transparent: false,
    show: true
  });

  const appPath = path.join(__dirname, 'www', 'index.html');

  window.loadURL('file://' + appPath);

  window.on('close', function () {
    window = null;
  });

  window.on('blur', function(){
    window.hide();
  });
});
