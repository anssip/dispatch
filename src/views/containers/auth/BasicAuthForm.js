import React from "react";
import { FormGroup, Text, Classes, Card, ControlGroup, HTMLSelect, InputGroup, Button, Tabs, Tab } from "@blueprintjs/core";
import styled from "styled-components";
import connect from "unstated-connect2";
import requestContainer from "../../../models/RequestContainer";

const R = require("ramda");

const Wrapper = styled.div``;

const BasicAuthForm = props => {
  const { username, password, setUsername, setPassword } = props;
  return (
    <Wrapper>
      <label class="bp3-label" >
        Username
        <input value={username} onChange={setUsername} class="bp3-input" style={{ width: "100%" }} type="text" placeholder="username" dir="auto" />
      </label>
      <label class="bp3-label" >
        Password
        <input value={password} onChange={setPassword} class="bp3-input" style={{ width: "100%" }} type="text" placeholder="password" dir="auto" />
      </label>
    </Wrapper>);
};


// @ts-ignore
export default connect({
  container: requestContainer,
  selector: ({ container }) => ({
    username: container.getAuthProps("basic").username,
    password: container.getAuthProps("basic").password,
    setUsername: R.partial(R.bind(container.setAuthProp, container), ["basic", "username"]),
    setPassword: R.partial(R.bind(container.setAuthProp, container), ["basic", "password"])
  })
})(BasicAuthForm);
