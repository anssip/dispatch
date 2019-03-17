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
      clientId,
      setClientId,
      clientSecret,
      setClientSecret,
      authorizationUrl,
      setAuthorizationUrl,
      accessTokenUrl,
      setAccessTokenUrl,
      redirectUrl,
      setRedirectUrl,
      access_token,
      refresh_token,
      token_type,
      token_scope,
      scope,
      set_access_token,
      set_refresh_token,
      set_token_type,
      set_scope
    } = this.props;

    const storeTokens = tokens => {
      console.log("Got tokens!", tokens);
      /*
          {
           "access_token":"2YotnFZFEjr1zCsicMWpAA",
           "token_type":"example",
           "expires_in":3600,
           "refresh_token":"tGzv3JOkF0XG5Qx2TlKWIA",
           "example_parameter":"example_value"
         }
        */
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

    // TODO: ender the fields from an array
    return (
      <>
        <ControlGroup fill={true}>
          <label class="bp3-label">Client ID</label>
          <FormField
            value={clientId}
            onChange={setClientId}
            class="bp3-input"
            style={{ width: "60%" }}
            type="text"
            dir="auto"
          />
        </ControlGroup>

        <label class="bp3-label">
          Client Secret
          <FormField
            value={clientSecret}
            onChange={setClientSecret}
            class="bp3-input"
            style={{ width: "100%" }}
            type="text"
            dir="auto"
          />
        </label>
        <label class="bp3-label">
          Authorization URL
          <FormField
            value={authorizationUrl}
            onChange={setAuthorizationUrl}
            class="bp3-input"
            style={{ width: "100%" }}
            type="text"
            dir="auto"
          />
        </label>
        <label class="bp3-label">
          Access Token URL
          <FormField
            value={accessTokenUrl}
            onChange={setAccessTokenUrl}
            class="bp3-input"
            style={{ width: "100%" }}
            type="text"
            dir="auto"
          />
        </label>
        <label class="bp3-label">
          Redirect URL
          <FormField
            value={redirectUrl}
            onChange={setRedirectUrl}
            class="bp3-input"
            style={{ width: "100%" }}
            type="text"
            dir="auto"
          />
        </label>
        <ControlGroup>
          <Button text="Fetch token" onClick={getTokens} />
          {refresh_token ? (
            <Button text="Refresh token" onClick={refreshToken} />
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
      clientId: oAuthProps.clientId,
      clientSecret: oAuthProps.clientSecret,
      authorizationUrl: oAuthProps.authorizationUrl,
      accessTokenUrl: oAuthProps.accessTokenUrl,
      redirectUrl: oAuthProps.redirectUrl,
      scope: oAuthProps.scope,

      setClientId: R.partial(setOAuthProp, ["clientId"]),
      setClientSecret: R.partial(setOAuthProp, ["clientSecret"]),
      setAccessTokenUrl: R.partial(setOAuthProp, ["accessTokenUrl"]),
      setAuthorizationUrl: R.partial(setOAuthProp, ["authorizationUrl"]),
      setRedirectUrl: R.partial(setOAuthProp, ["redirectUrl"]),
      setScope: R.partial(setOAuthProp, ["scope"]),

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
