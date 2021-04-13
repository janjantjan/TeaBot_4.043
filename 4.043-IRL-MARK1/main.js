const { app, BrowserWindow } = require("electron");
const { ipcMain } = require("electron"); 


let Bot = null;
let win = null;
function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  win.loadFile("index.html");
  win.webContents.openDevTools();   // opens the javascript console automatically for debugging
  //win.setFullScreen(true);
  //win.maximize();
}

function initBot() {
  // bot integration
  const DiscordBot = require("./DiscordBot").DiscordBot;
  Bot = new DiscordBot(win);

}

// This is required to be set to false beginning in Electron v9 otherwise
// the SerialPort module can not be loaded in Renderer processes like we are doing
// in this example. The linked Github issues says this will be deprecated starting in v10,
// however it appears to still be changed and working in v11.2.0
// Relevant discussion: https://github.com/electron/electron/issues/18397
app.allowRendererProcessReuse=false


app.whenReady().then(createWindow).then(initBot);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


// This receives messages from p5js and relays them to DiscordBot
ipcMain.on('messageFromP5', function (event, arg) {
  Bot.sendMessageToDiscord(arg);
})


