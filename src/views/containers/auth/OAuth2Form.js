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
import styled from "styled-components";
import connect from "unstated-connect2";
import requestContainer from "../../../models/RequestContainer";
import withValueChangeDetection from "../../components/Input";
import createAuthWindow from "./oauth2/auth-window";
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
        const resp = await fetchFunc();
        console.log("got response tokens", resp);
        storeTokens(resp);
        // this.setState({ error: null });
      } catch (error) {
        console.error("Failed to fetch token", error);
        this.setState({ error });
      }
    };
    const getTokens = R.partial(getTokensAndHandleError, [createAuthWindow]);
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
    const oAuthProps = container.getAuthProps("oAuth2");
    const setOAuthProp = R.partial(R.bind(container.setAuthProp, container), [
      "oAuth2"
    ]);
    return {
      formFields: [
        [
          "Client ID",
          oAuthProps.clientId,
          R.partial(setOAuthProp, ["clientId"])
        ],
        [
          "Client Secret",
          oAuthProps.clientSecret,
          R.partial(setOAuthProp, ["clientSecret"])
        ],
        [
          "Access Token URL",
          oAuthProps.accessTokenUrl,
          R.partial(setOAuthProp, ["accessTokenUrl"])
        ],
        [
          "Authorization URL",
          oAuthProps.authorizationUrl,
          R.partial(setOAuthProp, ["authorizationUrl"])
        ],
        [
          "Redirect URL",
          oAuthProps.redirectUrl,
          R.partial(setOAuthProp, ["redirectUrl"])
        ],
        ["Scope", oAuthProps.scope, R.partial(setOAuthProp, ["scope"])]
      ],
      access_token: oAuthProps.access_token,
      refresh_token: oAuthProps.refresh_token,
      token_type: oAuthProps.token_type,
      token_scope: oAuthProps.token_scope,

      set_access_token: R.partial(setOAuthProp, ["access_token"]),
      set_refresh_token: R.partial(setOAuthProp, ["refresh_token"]),
      set_token_type: R.partial(setOAuthProp, ["token_type"]),
      set_scope: R.partial(setOAuthProp, ["token_scope"])
    };
  }
})(OAuth2Form);
