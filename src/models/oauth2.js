const jwtDecode = require("jwt-decode");
const request = require("request");
const url = require("url");
// const envVariables = require('../env-variables');
const keytar = require("keytar");
const os = require("os");

// const {apiIdentifier, auth0Domain, clientId} = envVariables;

const redirectUri = `file:///callback`;

const keytarService = "electron-openid-oauth";
const keytarAccount = os.userInfo().username;

let accessToken = null;
let profile = null;
let refreshToken = null;

function getAccessToken() {
  return accessToken;
}

function getProfile() {
  return profile;
}

function refreshTokens() {
  return new Promise(async (resolve, reject) => {
    const refreshToken = await keytar.getPassword(keytarService, keytarAccount);

    if (!refreshToken) return reject();

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
      profile = jwtDecode(body.id_token);

      resolve();
    });
  });
}

function loadTokens(callbackURL) {
  return new Promise((resolve, reject) => {
    const urlParts = url.parse(callbackURL, true);
    const query = urlParts.query;

    const exchangeOptions = {
      grant_type: "authorization_code",
      client_id: "e1d3feefab9a06198e33",
      code: query.code,
      redirect_uri: redirectUri
    };

    // TODO: change to use the AUTH TOKEN URL supplied in the
    const options = {
      method: "POST",
      url: `https://github.com/login/oauth/access_token`,
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(exchangeOptions)
    };

    request(options, (error, resp, body) => {
      if (error || body.error) {
        logout();
        return reject(error || body.error);
      }

      const responseBody = JSON.parse(body);
      accessToken = responseBody.access_token;
      profile = jwtDecode(responseBody.id_token);
      refreshToken = responseBody.refresh_token;

      keytar.setPassword(keytarService, keytarAccount, refreshToken);

      resolve();
    });
  });
}

async function logout() {
  await keytar.deletePassword(keytarService, keytarAccount);
  accessToken = null;
  profile = null;
  refreshToken = null;
}

module.exports = {
  getAccessToken,
  getProfile,
  loadTokens,
  logout,
  refreshTokens
};
