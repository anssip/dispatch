import React from "react";
import { Divider, FormGroup, Text, Classes, Card, ControlGroup, HTMLSelect, InputGroup, Button, Tabs, Tab } from "@blueprintjs/core";
import styled from "styled-components";

const DetailContainer = styled.div`
  padding-top: 10px;
`;

const TopDivider = styled.div`
  margin-top: -10px;
`;

const RequestViewComponent = props =>
  <TopDivider>
    <Divider />
    <DetailContainer>
      {props.component}
    </DetailContainer>
  </TopDivider>
  ;

export default RequestViewComponent;