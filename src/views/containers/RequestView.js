import React from "react";
import { EditableText, Classes, Card, ControlGroup, HTMLSelect, InputGroup, Button, Tabs, Tab } from "@blueprintjs/core";
import styled from "styled-components";
import RequestViewComponent from "./RequestViewCompoent";
import BodyView from "./body/BodyView";
import connect from 'unstated-connect2';
import requestContainer from '../../models/RequestContainer';
import Input from "../components/Input";

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


class RequestView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { paneWidth: 0, prevReq: {}, name: null };
    this.prevRequest = {};
  }

  render() {
    const { container, request, paneWidth, setMethod, setName, setUrl } = this.props;

    if (request) {
      console.log(`${request.method}`);

      const onMethodChange = R.compose(
        R.partial(setMethod, [request]),
        R.prop('value'),
        R.prop('currentTarget'));

      const onUrlChange = R.partial(setUrl, [request]);      
      const onNameChange = R.partial(setName, [request]);

      return (
        <MainPane>
          <Card style={{ height: "100%" }}>
            <ControlGroup fill={true}>
              <HTMLSelect value={request.method} onChange={onMethodChange} options={METHODS} className={Classes.FIXED} />
              <Input value={request.url} onChange={onUrlChange} />
              <Button icon="arrow-right" className={Classes.FIXED} />
            </ControlGroup>
            <NameWrapper>
              {/* TODO: implement my own EditableText in the style of the Input component */}
              <EditableText value={request.name} onChange={onNameChange} />
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
  }
};

// @ts-ignore
export default connect({
  container: requestContainer,
  selector: ({ container }) => ({
    container,
    request: container.getSelected(),
    setMethod: R.bind(container.setMethod, container),
    setName: R.bind(container.setName, container),
    setUrl: R.bind(container.setUrl, container)
  })
})(RequestView);
