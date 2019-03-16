import authService from "../../../../models/oauth2";
const { BrowserWindow } = window.require("electron").remote;
// const createAppWindow = require('../main/app-process');

let win = null;

function getAuthenticationURL() {
  return (
    "https://github.com/login/oauth/authorize?" +
    "audience=myAudience&" +
    "scope=&" +
    "response_type=code&" +
    "client_id=e1d3feefab9a06198e33&" +
    "redirect_uri=https://dispatch.rest/callback"
  );
}

function destroyAuthWin() {
  if (!win) return;
  win.close();
  win = null;
}

function createAuthWindow() {
  console.log("createAuthWindow()");
  destroyAuthWin();

  // Create the browser window.
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: false
    }
  });

  console.log(`loading URL ${getAuthenticationURL()}`);
  win.loadURL(getAuthenticationURL());

  return new Promise((resolve, reject) => {
    const {
      session: { webRequest }
    } = win.webContents;
    const filter = {
      urls: ["https://dispatch.rest/*"]
    };
    webRequest.onBeforeRequest(filter, async ({ url }) => {
      console.log(`onBeforeRequest() url: ${url}`);
      const tokens = await authService.loadTokens(url);
      destroyAuthWin();
      resolve(tokens);
    });

    win.on("authenticated", () => {
      console.log("Authenticated!!!!");
      destroyAuthWin();
      reject();
    });

    win.on("closed", () => {
      win = null;
      reject();
    });
  });
}

export default createAuthWindow;
