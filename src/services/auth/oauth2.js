const request = require("request");
const url = require("url");
const querystring = require("querystring");
const { BrowserWindow, getCurrentWindow } = window.require("electron").remote;
const R = require("ramda");
let win = null;

const GRANT_TYPE_AUTH_CODE = 0;
const GRANT_TYPE_IMPLICIT = 1;
const GRANT_TYPE_RESOURCE_OWNER_PWD_CREDS = 2;
const GRANT_TYPE_CLIENT_CREDS = 3;

const responseTypes = new Map([
  [GRANT_TYPE_AUTH_CODE, "code"],
  [GRANT_TYPE_IMPLICIT, "token"]
]);

const buildAuthURL = props => {
  return (
    `${props.authorizationUrl}?` +
    (props.scope ? `scope=${props.scope}&` : "") +
    (props.audience ? `audience=${props.audience}&` : "") +
    `response_type=${responseTypes.get(parseInt(props.grantType))}` +
    `&client_id=${props.clientId}` +
    `&redirect_uri=${props.redirectUri}`
  );
};

const authClientCredentials = props => {
  //  https://developer.okta.com/authentication-guide/implementing-authentication/client-creds/#_1-setting-up-your-application
  console.log("clientCredentials", props);

  const exchangeOptions = {
    client_id: props.clientId,
    client_secret: props.clientSecret,
    audience: props.audience,
    grant_type: "client_credentials"
  };
  const options = {
    method: "POST",
    url: props.accessTokenUrl,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      Accept: "application/json"
    },
    auth: {
      username: props.clientId,
      password: props.clientSecret
    },
    body: JSON.stringify(exchangeOptions)
  };
  return doRequest(options);
};

const authResourceOwnerPwd = props => {
  // https://developer.okta.com/authentication-guide/implementing-authentication/password/#_1-setting-up-your-application
  console.log("authResourceOwnerPwd", props);

  const exchangeOptions = {
    username: props.username,
    password: props.password,
    grant_type: "password",
    scope: props.scope
  };
  const options = {
    method: "POST",
    url: props.accessTokenUrl,
    headers: {
      "content-type": "application/json",
      Accept: "application/json"
    },
    auth: {
      username: props.clientId,
      password: props.clientSecret
    },
    body: JSON.stringify(exchangeOptions)
  };
  return doRequest(options);
};

const authInWindow = props => {
  console.log("authInWindow()", props);
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

    console.log(`redirectUril = ${props.redirectUri}`);
    webRequest.onCompleted(() => {
      if (win) {
        win.show();
      }
    });
    win.webContents.on("did-navigate", async () => {
      const url = win.webContents.getURL();
      console.log(`Navigated to ${url}`);

      if (props.grantType == GRANT_TYPE_IMPLICIT) {
        try {
          const tokens = parseTokenFromUrl(url);
          if (tokens) {
            return resolve(tokens);
          } else {
            console.log(
              "Did not receive tokens. Still waiting for redirect and token..."
            );
          }
        } catch (err) {
          reject(err);
        }
      }
      if (props.grantType == GRANT_TYPE_AUTH_CODE) {
        const tokens = await requestTokens(props, url);
        // destroyAuthWin();
        resolve(tokens);
      }
    });
  });
};

const destroyAuthWin = () => {
  if (!win) return;
  win.close();
  win = null;
};

const parseTokenFromUrl = url => {
  if (url.match(/(error=)/)) throw new Error("Failed to fetch token: ${url}");
  if (url.match(/(access_token=)/)) {
    return querystring.parse(url.split("#")[1]);
  }
  return null;
};

const requestTokens = (props, callbackURL) => {
  console.log("requestTokens");
  const urlParts = url.parse(callbackURL, true);
  const query = urlParts.query;

  const exchangeOptions = {
    grant_type: "authorization_code",
    client_id: props.clientId,
    client_secret: props.clientSecret,
    code: query.code,
    redirect_uri: props.redirectUri
  };
  const options = {
    method: "POST",
    url: props.accessTokenUrl,
    headers: {
      "content-type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(exchangeOptions)
  };
  return doRequest(options);
};

const doRequest = options => {
  return new Promise((resolve, reject) => {
    request(options, (error, resp, responseBody) => {
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
    if (!props.refreshToken)
      return reject("Refresh token is required to refresh");
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

const loadTokens = props => {
  const authFunctions = new Map([
    [GRANT_TYPE_AUTH_CODE, authInWindow],
    [GRANT_TYPE_IMPLICIT, authInWindow],
    [GRANT_TYPE_RESOURCE_OWNER_PWD_CREDS, authResourceOwnerPwd],
    [GRANT_TYPE_CLIENT_CREDS, authClientCredentials]
  ]);
  console.log(`loadTokens() grant type: ${props.grantType}`, authFunctions);
  return authFunctions.get(parseInt(props.grantType))(props);
};

export default {
  loadTokens,
  refreshTokens,
  GRANT_TYPE_RESOURCE_OWNER_PWD_CREDS,
  GRANT_TYPE_AUTH_CODE,
  GRANT_TYPE_CLIENT_CREDS,
  GRANT_TYPE_IMPLICIT
};
