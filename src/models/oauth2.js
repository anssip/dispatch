const request = require("request");
const url = require("url");
const redirectUri = `https://dispatch.rest/callback`;
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

const loadTokens = props => {
  console.log("loadTokens()", props);
  destroyAuthWin();

  win = new BrowserWindow({
    // parent: getCurrentWindow(),
    // modal: true,
    // titleBarStyle: "customButtonsOnHover",
    show: false,
    width: 500,
    height: 600,
    webPreferences: {
      nodeIntegration: false
    }
  });
  console.log(`loading URL ${getAuthenticationURL()}`);
  win.loadURL(getAuthenticationURL());
  win.on("closed", () => {
    win = null;
  });

  return new Promise((resolve, reject) => {
    const {
      session: { webRequest }
    } = win.webContents;

    const filter = { urls: ["https://dispatch.rest/*"] };
    // Detect the redirect using the onBeforeRequest event
    webRequest.onBeforeRequest(filter, async ({ url }) => {
      console.log(`onBeforeRequest() url: ${url}`);
      try {
        const tokens = await requestTokens(url);
        // destroyAuthWin();
        resolve(tokens);
      } catch (e) {
        console.error(`Failed to fetch the token: ${e.message}`);
        destroyAuthWin();
        reject(e);
      }
    });
    webRequest.onErrorOccurred(details => {
      console.error("createAuthWindow():: onErrorOccurred", details);
      reject(new Error(`Authorization failed: ${details.error}`));
      // destroyAuthWin();
    });
    webRequest.onCompleted(filter, () => {
      win.show();
    });
  });
};

const destroyAuthWin = () => {
  if (!win) return;
  win.close();
  win = null;
};

const requestTokens = callbackURL => {
  console.log("requestTokens");

  return new Promise((resolve, reject) => {
    const urlParts = url.parse(callbackURL, true);
    const query = urlParts.query;
    const exchangeOptions = {
      grant_type: "authorization_code",
      client_id: "e1d3feefab9a06198e33",
      client_secret: "e5e33fd730ad073494513bb4e003af0237d80212",
      code: query.code,
      redirect_uri: redirectUri
    };
    // TODO: change to use the AUTH TOKEN URL supplied in the
    const options = {
      method: "POST",
      url: `https://github.com/login/oauth/access_token`,
      headers: {
        "content-type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(exchangeOptions)
    };
    request(options, (error, resp, body) => {
      console.log(body);
      if (error || resp.statusCode >= 400) {
        console.error("request failed", error);
        const msg =
          resp && resp.statusCode >= 400
            ? `Token request failed with status ${
                resp.statusCode
              }, ${JSON.stringify(resp)}`
            : `Failed to fetch token`;
        return reject(new Error(msg));
      }
      resolve(JSON.parse(body));
    });
  });
};

function refreshTokens(props) {
  return new Promise(async (resolve, reject) => {
    if (!props.refreshToken) return reject("Refresh is required to refresh");

    // TODO: change to use the AUTH TOKEN URL supplied in the
    const refreshOptions = {
      method: "POST",
      url: `https://github.com/login/oauth/access_token`,
      headers: { "content-type": "application/json" },
      body: {
        grant_type: "refresh_token",
        client_id: "e1d3feefab9a06198e33",
        refresh_token: props.refresh_token
      },
      json: true
    };
    request(refreshOptions, function(error, response, body) {
      if (error || body.error) {
        return reject(error || body.error);
      }
      resolve(body);
    });
  });
}

export default {
  loadTokens,
  refreshTokens
};
