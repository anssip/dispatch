import React from "react";
import { Divider, Classes, Card, ControlGroup, HTMLSelect, InputGroup, Button, Tabs, Tab } from "@blueprintjs/core";
import styled from "styled-components";
import RequestDetailPane from "./RequestDetailPane";
import BodyDetail from "./body/BodyDetail";

const METHODS = ["GET", "POST", "PUT", "DELETE", "OPTIONS"];

const TabContainer = styled.div`
  margin-top 20px;
`;

const MainPane = styled.div`
  height: 100%;
`;

const RequestDetails = props =>
  <MainPane>
    <Card style={{ height: "100%" }}>
      <ControlGroup fill={true}>
        <HTMLSelect options={METHODS} className={Classes.FIXED} />
        <InputGroup placeholder="http://localhost:8080/users" />
        <Button icon="arrow-right" className={Classes.FIXED} />
      </ControlGroup>
      <TabContainer>
        <Tabs id="mainTabs" onChange={_ => console.log('request tab changed')} defaultSelectedTabId="body">
          <Tab id="body" title="Body" panel={<RequestDetailPane component={<BodyDetail paneWidth={props.paneWidth} />} />} />
          <Tab id="query" title="Query" />
          <Tab id="headers" title="Headers" />
          <Tab id="auth" title="Auth" />
        </Tabs>
      </TabContainer>
    </Card>
  </MainPane>
  ;

export default RequestDetails;