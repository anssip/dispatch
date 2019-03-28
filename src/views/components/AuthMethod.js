import React from "react";
import styled from "styled-components";
import { Card, Text, Colors } from "@blueprintjs/core";
const R = require("ramda");

// blueprint Indogo5
const Type = styled.span`
  color: #ad99ff;
  margin-right: 5px;
`;

const Wrapper = styled.div`
  padding: 5px 0 5px 0;
  padding-left: 5px;
  cursor: pointer;
  user-select: none;
  border-bottom: 1px solid #5c7080;
`;

const AuthMethod = props => (
  <Wrapper
    style={
      props.model.selected
        ? { color: "#fff", backgroundColor: "#394B59" }
        : { color: "#aaa" }
    }
    onClick={props.handleClick}
  >
    <Text ellipsize={true}>
      <Type>{props.model.type}</Type>
      {props.model.name}
    </Text>
  </Wrapper>
);

export default AuthMethod;
