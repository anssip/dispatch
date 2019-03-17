import React, { PureComponent } from "react";
import {
  FormGroup,
  TextArea,
  Classes,
  Card,
  ControlGroup,
  HTMLSelect,
  InputGroup,
  Button
} from "@blueprintjs/core";
import connect from "unstated-connect2";
import requestContainer from "../../../models/RequestContainer";
import withValueChangeDetection from "../../components/Input";
import authService from "../../../models/oauth2";

const R = require("ramda");
const FormField = withValueChangeDetection(
  props => <input className="bp3-input" {...props} />,
  R.compose(
    R.prop("value"),
    R.prop("target")
  )
);

class OAuth2Form extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  render() {
    const {
      authProps,
      formFields,
      access_token,
      refresh_token,
      token_type,
      token_scope,
      set_access_token,
      set_refresh_token,
      set_token_type,
      set_scope
    } = this.props;

    const storeTokens = tokens => {
      console.log("Got tokens!", tokens);
      const setters = {
        access_token: set_access_token,
        refresh_token: set_refresh_token,
        token_type: set_token_type,
        scope: set_scope
      };
      R.forEach(
        key => R.prop(key, setters)(R.prop(key, tokens)),
        R.keys(setters)
      );
    };
    const getTokensAndHandleError = async fetchFunc => {
      try {
        const resp = await fetchFunc(authProps);
        console.log("got response tokens", resp);
        this.setState({ error: null });
        storeTokens(resp);
      } catch (error) {
        console.error("Failed to fetch token", error);
        this.setState({ error });
      }
    };
    const getTokens = R.partial(getTokensAndHandleError, [
      authService.loadTokens
    ]);
    const refreshToken = R.partial(getTokensAndHandleError, [
      authService.refreshTokens
    ]);
    return (
      <>
        {formFields.map((f, i) => (
          <ControlGroup fill={true}>
            <label style={{ width: "180px" }} class="bp3-label">
              {f[0]}
            </label>
            <FormField
              value={f[1]}
              onChange={f[2]}
              class="bp3-input"
              style={{ width: "100%" }}
              type="text"
              dir="auto"
            />
          </ControlGroup>
        ))}
        <ControlGroup style={{ marginTop: "10px" }}>
          <Button
            intent="primary"
            icon="exchange"
            text="Fetch token"
            onClick={getTokens}
          />
          {refresh_token ? (
            <Button
              icon="refresh"
              text="Refresh token"
              onClick={refreshToken}
            />
          ) : (
            <Button text="Refresh token" disabled />
          )}
        </ControlGroup>
        <TextArea
          style={{ height: "100px" }}
          fill={true}
          value={
            this.state.error
              ? this.state.error
              : `access_token: ${access_token || ""}
token_type: ${token_type || ""}
refresh_token: ${refresh_token || ""}
scope: ${token_scope || ""}`
          }
        />
      </>
    );
  }
}

// @ts-ignore
export default connect({
  container: requestContainer,
  selector: ({ container }) => {
    const authProps = container.getAuthProps("oAuth2");
    const setOAuthProp = R.partial(R.bind(container.setAuthProp, container), [
      "oAuth2"
    ]);
    return {
      authProps,
      formFields: [
        [
          "Client ID",
          authProps.clientId,
          R.partial(setOAuthProp, ["clientId"])
        ],
        [
          "Client Secret",
          authProps.clientSecret,
          R.partial(setOAuthProp, ["clientSecret"])
        ],
        [
          "Access Token URL",
          authProps.accessTokenUrl,
          R.partial(setOAuthProp, ["accessTokenUrl"])
        ],
        [
          "Authorization URL",
          authProps.authorizationUrl,
          R.partial(setOAuthProp, ["authorizationUrl"])
        ],
        [
          "Redirect URI",
          authProps.redirectUri,
          R.partial(setOAuthProp, ["redirectUri"])
        ],
        ["Scope", authProps.scope, R.partial(setOAuthProp, ["scope"])]
      ],
      access_token: authProps.access_token,
      refresh_token: authProps.refresh_token,
      token_type: authProps.token_type,
      token_scope: authProps.token_scope,

      set_access_token: R.partial(setOAuthProp, ["access_token"]),
      set_refresh_token: R.partial(setOAuthProp, ["refresh_token"]),
      set_token_type: R.partial(setOAuthProp, ["token_type"]),
      set_scope: R.partial(setOAuthProp, ["token_scope"])
    };
  }
})(OAuth2Form);
