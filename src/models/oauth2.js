const jwtDecode = require("jwt-decode");
const request = require("request");
const url = require("url");
const keytar = window.require("keytar");
const os = window.require("os");

const redirectUri = `https://dispatch.rest/callback`;
const keytarService = "electron-openid-oauth";
const keytarAccount = os.userInfo().username;

let accessToken = null;

function getAccessToken() {
  return accessToken;
}

function refreshTokens() {
  return new Promise(async (resolve, reject) => {
    const refreshToken = await keytar.getPassword(keytarService, keytarAccount);

    if (!refreshToken) return reject("Refresh token not");

    // TODO: change to use the AUTH TOKEN URL supplied in the
    const refreshOptions = {
      method: "POST",
      url: `https://github.com/login/oauth/access_token`,
      headers: { "content-type": "application/json" },
      body: {
        grant_type: "refresh_token",
        client_id: "e1d3feefab9a06198e33",
        refresh_token: refreshToken
      },
      json: true
    };

    request(refreshOptions, function(error, response, body) {
      if (error || body.error) {
        logout();
        return reject(error || body.error);
      }
      accessToken = body.access_token;
      resolve();
    });
  });
}

function loadTokens(callbackURL) {
  console.log("loadTokens");
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
      if (error || body.error) {
        logout();
        return reject(error || body.error);
      }
      const responseBody = JSON.parse(body);
      const refreshToken = responseBody.refresh_token;
      if (refreshToken) {
        keytar.setPassword(keytarService, keytarAccount, refreshToken);
      }
      resolve(responseBody);
    });
  });
}

async function logout() {
  await keytar.deletePassword(keytarService, keytarAccount);
  accessToken = null;
}

export default {
  getAccessToken,
  loadTokens,
  logout,
  refreshTokens
};
