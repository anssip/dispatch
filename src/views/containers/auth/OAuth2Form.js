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
import authContainer from "../../../models/AuthContainer";
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
  container: authContainer,
  selector: ({ container }) => {
    const props = container.getSelected();
    const setProp = R.bind(container.setProp, container);
    return {
      authProps: props,
      formFields: [
        ["Client ID", props.clientId, R.partial(setProp, ["clientId"])],
        [
          "Client Secret",
          props.clientSecret,
          R.partial(setProp, ["clientSecret"])
        ],
        [
          "Access Token URL",
          props.accessTokenUrl,
          R.partial(setProp, ["accessTokenUrl"])
        ],
        [
          "Authorization URL",
          props.authorizationUrl,
          R.partial(setProp, ["authorizationUrl"])
        ],
        [
          "Redirect URI",
          props.redirectUri,
          R.partial(setProp, ["redirectUri"])
        ],
        ["Scope", props.scope, R.partial(setProp, ["scope"])]
      ],
      access_token: props.access_token,
      refresh_token: props.refresh_token,
      token_type: props.token_type,
      token_scope: props.token_scope,

      set_access_token: R.partial(setProp, ["access_token"]),
      set_refresh_token: R.partial(setProp, ["refresh_token"]),
      set_token_type: R.partial(setProp, ["token_type"]),
      set_scope: R.partial(setProp, ["token_scope"])
    };
  }
})(OAuth2Form);
