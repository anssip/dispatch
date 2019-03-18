import React from "react";
import styled from "styled-components";
import { Card, Text, Colors } from "@blueprintjs/core";
const R = require("ramda");

// blueprint Indogo5
const Type = styled.span`
  color: #ad99ff;
  margin-right: 5px;
`;

const RequestCard = styled.div`
  padding: 10px;
  margin-left: -10px;
  cursor: pointer;
`;

const AuthMethod = props => (
  <RequestCard
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
  </RequestCard>
);

export default AuthMethod;
