import React from "react";
import {
  FormGroup,
  Text,
  Classes,
  Card,
  ControlGroup,
  HTMLSelect,
  InputGroup,
  Button,
  Tabs,
  Tab
} from "@blueprintjs/core";
import styled from "styled-components";
import connect from "unstated-connect2";
import authContainer from "../../../models/AuthContainer";
import withValueChangeDetection from "../../components/Input";

const R = require("ramda");
const FormField = withValueChangeDetection(
  props => <input className="bp3-input" {...props} />,
  R.compose(
    R.prop("value"),
    R.prop("target")
  )
);

const BasicAuthForm = props => {
  const { username, password, setUsername, setPassword } = props;
  return (
    <>
      <label class="bp3-label">
        Username
        <FormField
          value={username}
          onChange={setUsername}
          class="bp3-input"
          style={{ width: "100%" }}
          type="text"
          placeholder="username"
          dir="auto"
        />
      </label>
      <label class="bp3-label">
        Password
        <FormField
          value={password}
          onChange={setPassword}
          class="bp3-input"
          style={{ width: "100%" }}
          type="text"
          placeholder="password"
          dir="auto"
        />
      </label>
    </>
  );
};

// @ts-ignore
export default connect({
  container: authContainer,
  selector: ({ container }) => ({
    username: container.getProp("username"),
    password: container.getProp("password"),
    setUsername: R.partial(R.bind(container.setProp, container), ["username"]),
    setPassword: R.partial(R.bind(container.setProp, container), ["password"])
  })
})(BasicAuthForm);
