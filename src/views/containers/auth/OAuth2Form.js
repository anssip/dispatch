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
import { get } from "http";

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
    this.state = { tokens: null };
  }
  async getTokens() {
    const tokens = await createAuthWindow();
    console.log("Got tokens!", tokens);
    this.setState({ tokens });
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
      setRedirectUrl
    } = this.props;
    return (
      <>
        <label class="bp3-label">
          Client ID
          <FormField
            value={clientId}
            onChange={setClientId}
            class="bp3-input"
            style={{ width: "100%" }}
            type="text"
            dir="auto"
          />
        </label>
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
          <Button text="Fetch token" onClick={R.bind(this.getTokens, this)} />
          <Button text="Refresh token" onClick={R.bind(this.getTokens, this)} />
        </ControlGroup>
        <TextArea
          fill={true}
          value={
            this.state.tokens ? JSON.stringify(this.state.tokens, null, 2) : ""
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

      setClientId: R.partial(setOAuthProp, ["clientId"]),
      setClientSecret: R.partial(setOAuthProp, ["clientSecret"]),
      setAccessTokenUrl: R.partial(setOAuthProp, ["accessTokenUrl"]),
      setAuthorizationUrl: R.partial(setOAuthProp, ["authorizationUrl"]),
      setRedirectUrl: R.partial(setOAuthProp, ["redirectUrl"])
    };
  }
})(OAuth2Form);
