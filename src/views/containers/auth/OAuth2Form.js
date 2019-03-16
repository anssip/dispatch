import React, { PureComponent } from "react";
import {
  FormGroup,
  Text,
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

const R = require("ramda");
const FormField = withValueChangeDetection(
  props => <input className="bp3-input" {...props} />,
  R.compose(
    R.prop("value"),
    R.prop("target")
  )
);

class OAuth2Form extends PureComponent {
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
