import authService from "../../../../models/oauth2";
const { BrowserWindow, getCurrentWindow } = window.require("electron").remote;
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

  win = new BrowserWindow({
    // parent: getCurrentWindow(),
    // modal: true,
    // titleBarStyle: "customButtonsOnHover",
    width: 500,
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
    webRequest.onErrorOccurred(details => {
      console.error("createAuthWindow():: onErrorOccurred", details);
      reject(new Error(`Authorization failed: ${details.error}`));
      destroyAuthWin();
    });
    webRequest.onHeadersReceived(details => {
      console.debug("createAuthWindow():: onHeadersReceived", details);
      if (details.statusCode >= 400) {
        reject(
          new Error(
            `Authorization failed with status ${details.statusCode}: ${
              details.statusLine
            }`
          )
        );
      }
      destroyAuthWin();
    });
    webRequest.onResponseStarted(details => {
      console.debug("createAuthWindow():: onResponseStarted", details);
    });
    webRequest.onCompleted(details => {
      console.debug("createAuthWindow():: onCompleted", details);
    });
  });
}

export default createAuthWindow;
