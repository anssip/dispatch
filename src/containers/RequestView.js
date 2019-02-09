import React from "react";
import { EditableText, Classes, Card, ControlGroup, HTMLSelect, InputGroup, Button, Tabs, Tab } from "@blueprintjs/core";
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

const NameWrapper = styled.h2`
  margin-top: 10px;
  text-align: left;
`;

const RequestView = ({ request, paneWidth, setMethod, setName }) => {
  if (request) {
    console.log(`${request.method}`);

    const onMethodChange = R.compose(R.partial(setMethod, [request]), R.prop('value'), R.prop('currentTarget'));
    return (
    <MainPane>
      <Card style={{ height: "100%" }}>
        <ControlGroup fill={true}>
          <HTMLSelect value={request.method} onChange={onMethodChange} options={METHODS} className={Classes.FIXED} />
          {/* TODO: wire URL with RequestContainer */}
          <InputGroup value={request.url} placeholder="http://localhost:8080/users" />
          <Button icon="arrow-right" className={Classes.FIXED} />
        </ControlGroup>
        <NameWrapper>
          <EditableText value={request.name} onChange={R.partial(setName, [request])} />
        </NameWrapper>

        <TabContainer>
          <Tabs id="mainTabs" onChange={_ => console.log('request tab changed')} defaultSelectedTabId="body">
            <Tab id="body" title="Body" panel={<RequestViewComponent component={<BodyView paneWidth={paneWidth} />} />} />
            <Tab id="query" title="Query" />
            <Tab id="headers" title="Headers" />
            <Tab id="auth" title="Auth" />
          </Tabs>
        </TabContainer>
      </Card>
    </MainPane>);
  } else {
    return <div>Select a request</div>;
  }
};

// @ts-ignore
export default connect({
  container: requestContainer,
  selector: ({ container }) => ({
    request: container.getSelected(),
    setMethod: R.bind(container.setMethod, container),
    setName: R.bind(container.setName, container)
  })
})(RequestView);
