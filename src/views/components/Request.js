import React from "react";
import styled from "styled-components";
import { Card, Text, Colors } from "@blueprintjs/core";
const R = require("ramda");

// blueprint Indogo5
const Method = styled.span`
  color: #ad99ff;
  margin-right: 5px;
`;

const RequestCard = styled.div`
  padding: 5px 0 5px 0;
  padding-left: 5px;
  cursor: pointer;
  user-select: none;
  border-bottom: 1px solid #5c7080;
`;

const Request = props => (
  <RequestCard
    style={
      props.model.selected
        ? { color: "#fff", backgroundColor: "#394B59" }
        : { color: "#aaa" }
    }
    onClick={props.handleClick}
  >
    <Text ellipsize={true}>
      <Method>{props.model.method}</Method>
      {props.model.name}
    </Text>
  </RequestCard>
);

export default Request;
