import React from "react";
import { EditableText, Classes, Card, ControlGroup, HTMLSelect, InputGroup, Button, Tabs, Tab } from "@blueprintjs/core";
import styled from "styled-components";
import RequestViewComponent from "./RequestViewCompoent";
import BodyView from "./body/BodyView";
import connect from 'unstated-connect2';
import requestContainer from '../../models/RequestContainer';
import withValueChangeDetection from "../components/Input";

const R = require('ramda');
const UrlInput = withValueChangeDetection(props => <input className="bp3-input" {...props} />, R.compose(R.prop("value"), R.prop("target")));
const NameInput = withValueChangeDetection(props => <EditableText {...props} />, R.identity);

// const NameInput = React.memo(props => <EditableText {...props} />);

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
    this.state = { prevReq: {}, name: null };
    this.prevRequest = {};
  }

  render() {
    const { request, paneWidth, paneHeight, setMethod, setName, setUrl } = this.props;

    if (request && request.name) {
      const onMethodChange = R.compose(
        R.partial(setMethod, [request]),
        R.prop('value'),
        R.prop('currentTarget'));

      const onUrlChange = R.partial(setUrl, [request]);      
      const onNameChange = R.partial(setName, [request]);

      return (
        <MainPane>
          <Card style={{ margin: 0, paddingBottom: 0, height: "100%" }}>
            <ControlGroup fill={true}>
              <HTMLSelect value={request.method} onChange={onMethodChange} options={METHODS} className={Classes.FIXED} />
              <UrlInput value={request.url} onChange={onUrlChange} />
              {/* <Input value={request.url} onChange={onUrlChange} /> */}
              <Button icon="arrow-right" className={Classes.FIXED} />
            </ControlGroup>
            <NameWrapper>
              <NameInput value={request.name} onChange={onNameChange} />
            </NameWrapper>

            <TabContainer>
              <Tabs id="mainTabs" onChange={_ => console.log('request tab changed')} defaultSelectedTabId="body">
                <Tab id="body" title="Body" panel={<RequestViewComponent component={<BodyView paneWidth={paneWidth} paneHeight={paneHeight} />} />} />
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
  selector: ({ container, paneWidth, paneHeight }) => ({
    paneWidth,
    paneHeight,
    request: container.getSelected(),
    setMethod: R.bind(container.setMethod, container),
    setName: R.bind(container.setName, container),
    setUrl: R.bind(container.setUrl, container)
  })
})(RequestView);
