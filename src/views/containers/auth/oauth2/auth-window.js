// this window should load the Authorization URL

const authService = require("../../../../models/oauth2");
const { BrowserWindow } = require("electron").remote;
// const createAppWindow = require('../main/app-process');

let win = null;

function getAuthenticationURL() {
  return (
    "https://github.com/login/oauth/authorize?" +
    "audience=myAudience&" +
    "scope=&" +
    "response_type=code&" +
    "client_id=e1d3feefab9a06198e33&" +
    "redirect_uri=https://dispatch.rest/redirect"
  );
}

function destroyAuthWin() {
  if (!win) return;
  win.close();
  win = null;
}

function createAuthWindow() {
  destroyAuthWin();

  // Create the browser window.
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: false
    }
  });

  win.loadURL(authService.getAuthenticationURL());

  const {
    session: { webRequest }
  } = win.webContents;

  const filter = {
    urls: ["file:///callback*"]
  };

  webRequest.onBeforeRequest(filter, async ({ url }) => {
    await authService.loadTokens(url);
    // createAppWindow();
    return destroyAuthWin();
  });

  win.on("authenticated", () => {
    console.log("Authenticated!!!!");
    destroyAuthWin();
  });

  win.on("closed", () => {
    win = null;
  });
}

module.exports = createAuthWindow;
