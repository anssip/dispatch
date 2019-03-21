import React, { Component, PureComponent } from "react";
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

const {
  GRANT_TYPE_AUTH_CODE,
  GRANT_TYPE_CLIENT_CREDS,
  GRANT_TYPE_IMPLICIT,
  GRANT_TYPE_RESOURCE_OWNER_PWD_CREDS
} = authService;
const R = require("ramda");
const FormField = withValueChangeDetection(
  props => <input className="bp3-input" {...props} />,
  R.compose(
    R.prop("value"),
    R.prop("target")
  )
);
const createFormField = (value, onChange, display) => (
  <FormField
    value={value}
    onChange={onChange}
    class="bp3-input"
    style={{ width: "100%", display }}
    type="text"
    dir="auto"
  />
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
      grantType,
      access_token,
      refresh_token,
      token_type,
      token_scope,
      set_access_token,
      set_refresh_token,
      set_token_type,
      set_scope,
      setGrantType
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
    const grantTypes = [
      { value: GRANT_TYPE_AUTH_CODE, label: "Authorization Code" },
      { value: GRANT_TYPE_IMPLICIT, label: "Implicit" },
      {
        value: GRANT_TYPE_RESOURCE_OWNER_PWD_CREDS,
        label: "Password Credentials"
      },
      { value: GRANT_TYPE_CLIENT_CREDS, label: "Client Credentials" }
    ];

    return (
      <>
        <ControlGroup fill={true}>
          <label style={{ width: "180px" }} class="bp3-label">
            Grant type
          </label>
          <HTMLSelect
            fill={true}
            style={{ width: "100%" }}
            value={grantType}
            onChange={setGrantType}
            options={grantTypes}
          />
        </ControlGroup>
        {formFields.map((f, i) => (
          <ControlGroup fill={true}>
            <label
              style={{
                width: "180px",
                color: f[3].indexOf(grantType) >= 0 ? "#fff" : "#777"
              }}
              class="bp3-label"
            >
              {f[0]}
            </label>
            <FormField
              value={f[1]}
              onChange={f[2]}
              class="bp3-input"
              style={{
                width: "100%",
                display: f[3].indexOf(grantType) >= 0 ? "block" : "none"
              }}
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
        [
          "Client ID",
          props.clientId,
          R.partial(setProp, ["clientId"]),
          [
            GRANT_TYPE_AUTH_CODE,
            GRANT_TYPE_IMPLICIT,
            GRANT_TYPE_RESOURCE_OWNER_PWD_CREDS,
            GRANT_TYPE_CLIENT_CREDS
          ]
        ],
        [
          "Client Secret",
          props.clientSecret,
          R.partial(setProp, ["clientSecret"]),
          [
            GRANT_TYPE_AUTH_CODE,
            GRANT_TYPE_RESOURCE_OWNER_PWD_CREDS,
            GRANT_TYPE_CLIENT_CREDS
          ]
        ],
        [
          "Access Token URL",
          props.accessTokenUrl,
          R.partial(setProp, ["accessTokenUrl"]),
          [GRANT_TYPE_AUTH_CODE, GRANT_TYPE_CLIENT_CREDS]
        ],
        [
          "Authorization URL",
          props.authorizationUrl,
          R.partial(setProp, ["authorizationUrl"]),
          [GRANT_TYPE_AUTH_CODE, GRANT_TYPE_IMPLICIT]
        ],
        [
          "Redirect URI",
          props.redirectUri,
          R.partial(setProp, ["redirectUri"]),
          [GRANT_TYPE_AUTH_CODE, GRANT_TYPE_IMPLICIT]
        ],
        [
          "Username",
          props.usrname,
          R.partial(setProp, ["username"]),
          [GRANT_TYPE_RESOURCE_OWNER_PWD_CREDS]
        ],
        [
          "Password",
          props.password,
          R.partial(setProp, ["password"]),
          [GRANT_TYPE_RESOURCE_OWNER_PWD_CREDS]
        ],
        [
          "Scope",
          props.scope,
          R.partial(setProp, ["scope"]),
          [
            GRANT_TYPE_AUTH_CODE,
            GRANT_TYPE_IMPLICIT,
            GRANT_TYPE_RESOURCE_OWNER_PWD_CREDS,
            GRANT_TYPE_CLIENT_CREDS
          ]
        ]
      ],
      grantType: parseInt(props.grantType) || 0,
      access_token: props.access_token,
      refresh_token: props.refresh_token,
      token_type: props.token_type,
      token_scope: props.token_scope,

      setGrantType: R.compose(
        R.partial(setProp, ["grantType"]),
        R.prop("value"),
        R.prop("currentTarget")
      ),
      set_access_token: R.partial(setProp, ["access_token"]),
      set_refresh_token: R.partial(setProp, ["refresh_token"]),
      set_token_type: R.partial(setProp, ["token_type"]),
      set_scope: R.partial(setProp, ["token_scope"])
    };
  }
})(OAuth2Form);
