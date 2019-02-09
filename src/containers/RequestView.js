import React from "react";
import { Divider, Classes, Card, ControlGroup, HTMLSelect, InputGroup, Button, Tabs, Tab } from "@blueprintjs/core";
import styled from "styled-components";
import RequestViewComponent from "./RequestViewCompoent";
import BodyView from "./body/BodyView";
import connect from 'unstated-connect2';
import requestContainer from '../models/RequestContainer';

const R = require('ramda');

const METHODS = ["GET", "POST", "PUT", "DELETE", "OPTIONS"];

const TabContainer = styled.div`
  margin-top 20px;
`;

const MainPane = styled.div`
  height: 100%;
`;

const RequestView = ({ request, paneWidth }) =>
  <MainPane>
    <Card style={{ height: "100%" }}>
      <ControlGroup fill={true}>
        <HTMLSelect options={METHODS} className={Classes.FIXED} />
        <InputGroup value={request.url} placeholder="http://localhost:8080/users" />
        <Button icon="arrow-right" className={Classes.FIXED} />
      </ControlGroup>
      <TabContainer>
        <Tabs id="mainTabs" onChange={_ => console.log('request tab changed')} defaultSelectedTabId="body">
          <Tab id="body" title="Body" panel={<RequestViewComponent component={<BodyView paneWidth={paneWidth} />} />} />
          <Tab id="query" title="Query" />
          <Tab id="headers" title="Headers" />
          <Tab id="auth" title="Auth" />
        </Tabs>
      </TabContainer>
    </Card>
  </MainPane>
  ;

// @ts-ignore
export default connect({
  container: requestContainer,
  selector: ({ container }) => ({
    request: container.getSelected()
  })
})(RequestView);
