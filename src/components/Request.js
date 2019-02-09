import React from "react";
import styled from "styled-components";
import { Card, Text, Colors } from "@blueprintjs/core";

// blueprint Indogo5
const Method = styled.span`
  color: #AD99FF;
  margin-right: 5px;
`;

const RequestCard = styled.div`
  padding: 5px;
  cursor: pointer;
`;

const Request = props => (
  <RequestCard onClick={props.handleClick}>
    <Text ellipsize={true}>
      <Method>{props.model.method}</Method>
      {props.model.name}
    </Text>
  </RequestCard>
);

export default Request;
