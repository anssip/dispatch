import React from "react";
import styled from "styled-components";
import { Card, Text, Colors } from "@blueprintjs/core";
const R = require('ramda');

// blueprint Indogo5
const Method = styled.span`
  color: #AD99FF;
  margin-right: 5px;
`;

const RequestCard = styled.div`
  padding: 10px;
  margin-left: -10px;
  cursor: pointer;
`;

const Request = props => (
  <RequestCard style={props.model.selected ? { color: "#fff", backgroundColor: "#394B59" } : { color: "#aaa" }} onClick={R.partial(props.handleClick, 'request')}>
    <Text ellipsize={true}>
      <Method>{props.model.method}</Method>
      {props.model.name}
    </Text>
  </RequestCard>
);

export default Request;
