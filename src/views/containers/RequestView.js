import React from "react";
import { EditableText, Classes, Card, ControlGroup, HTMLSelect, InputGroup, Button, Tabs, Tab } from "@blueprintjs/core";
import styled from "styled-components";
import RequestViewComponent from "./RequestViewCompoent";
import BodyView from "./body/BodyView";
import connect from 'unstated-connect2';
import requestContainer from '../../models/RequestContainer';
import contextContainer from '../../models/ContextContainer';
import withValueChangeDetection from "../components/Input";
import Dispatcher from "../../models/Dispatcher";

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
    const { request, paneWidth, paneHeight, setMethod, setName, setUrl, dispatchSelected } = this.props;

    if (request && request.name) {
      const onMethodChange = R.compose(
        setMethod,
        R.prop('value'),
        R.prop('currentTarget'));

      return (
        <MainPane>
          <Card style={{ margin: 0, paddingBottom: 0, height: "100%" }}>
            <ControlGroup fill={true}>
              <HTMLSelect value={request.method} onChange={onMethodChange} options={METHODS} className={Classes.FIXED} />
              <UrlInput value={request.url} onChange={setUrl} />
              
              <Button icon="arrow-right" className={Classes.FIXED} onClick={dispatchSelected}/>
            </ControlGroup>
            <NameWrapper>
              <NameInput value={request.name} onChange={setName} />
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
  containers: [requestContainer, contextContainer],
  selector: ({ containers, paneWidth, paneHeight }) => ({
    paneWidth,
    paneHeight,
    request: containers[0].getSelected(),
    setMethod: R.bind(containers[0].setMethod, containers[0]),
    setName: R.bind(containers[0].setName, containers[0]),
    setUrl: R.bind(containers[0].setUrl, containers[0]),
    dispatchSelected: R.partial((new Dispatcher(...containers)).dispatch, [containers[0].getSelected()])
  })
})(RequestView);
