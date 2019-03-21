const request = require("request");
const url = require("url");
const { BrowserWindow, getCurrentWindow } = window.require("electron").remote;
let win = null;

const GRANT_TYPE_AUTH_CODE = 0;
const GRANT_TYPE_IMPLICIT = 1;
const GRANT_TYPE_RESOURCE_OWNER_PWD_CREDS = 2;
const GRANT_TYPE_CLIENT_CREDS = 3;

function buildAuthURL(props) {
  return (
    `${props.authorizationUrl}?` +
    (props.scope ? `scope=${props.scope}&` : "") +
    `response_type=code` +
    `&client_id=${props.clientId}` +
    `&redirect_uri=${props.redirectUri}`
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
  const authUrl = buildAuthURL(props);
  console.log(`loading URL ${authUrl}`);
  win.loadURL(authUrl);
  // https://github.com/login/oauth/authorize&response_type=code&client_id=e1d3feefab9a06198e33&redirect_uri=https://dispatch.rest/callback

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
        const tokens = await requestTokens(props, url);
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

const requestTokens = (props, callbackURL) => {
  console.log("requestTokens");

  return new Promise((resolve, reject) => {
    const urlParts = url.parse(callbackURL, true);
    const query = urlParts.query;

    const exchangeOptions = {
      grant_type: "authorization_code",
      client_id: props.clientId,
      client_secret: props.clientSecret,
      code: query.code,
      redirect_uri: props.redirectUri
    };
    // TODO: change to use the AUTH TOKEN URL supplied in the
    const options = {
      method: "POST",
      url: props.accessTokenUrl,
      headers: {
        "content-type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(exchangeOptions)
    };
    request(options, (error, resp, responseBody) => {
      destroyAuthWin();
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
      const body = JSON.parse(responseBody);
      console.log("Response body", body);
      if (body.error) {
        console.error(`Rejecting with error ${body.error}`);
        return reject(new Error(`${body.error}: ${JSON.stringify(body)}`));
      }

      resolve(body);
    });
  });
};

function refreshTokens(props) {
  return new Promise((resolve, reject) => {
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
  refreshTokens,
  GRANT_TYPE_RESOURCE_OWNER_PWD_CREDS,
  GRANT_TYPE_AUTH_CODE,
  GRANT_TYPE_CLIENT_CREDS,
  GRANT_TYPE_IMPLICIT
};
