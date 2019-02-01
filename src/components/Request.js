import React from "react";
import styled from "styled-components";

const RequestBox = styled.div`
  overflow: hidden;
  margin-top: 5px;
`;

const Method = styled.span`
  color: red;
`;

const Name = styled.div`
  color: grey;
  white-space: nowrap;
`;

const Url = styled.span`
  color: black;
  white-space: nowrap;
  margin-left: 5px;
`;

const Request = props => (
  <RequestBox>
    <Name>{props.model.name}</Name>
    <Method>{props.model.method}</Method>
    <Url>{props.model.url}</Url>
  </RequestBox>
);

export default Request;
