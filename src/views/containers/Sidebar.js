import React from "react";
import { Card, Tab, Tabs, ButtonGroup, Button, Popover, Menu, MenuItem } from "@blueprintjs/core";
import styled from "styled-components";
import RequestList from './RequestList';
import ContextEditor from './context/ContextEditor';
import EnvironmentEditor from './EnvironmentEditor';
import connect from 'unstated-connect2';
import requestContainer from '../../models/RequestContainer';
import contextContainer from '../../models/ContextContainer';

const R = require('ramda');

const BottomBar = styled.div`
  position: fixed;
  bottom: 0;
`;

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tab: "requests" }
  }
  render() {
    const { add } = this.props;

    const addClicked = () => {
      if (this.state.tab === "context") {
        this.changeTab("requests");
        add.requests();
      } else {
        add[this.state.tab]();
      }
    };

    return <Card className='left-pane'>
      <Tabs id="sidebarTabs" onChange={tab => this.changeTab(tab)} renderActiveTabPanelOnly={true} selectedTabId={this.state.tab} >
        <Tab id="requests" title="Requests" panel={<RequestList />} />
        <Tab id="context" title="Context" panel={<ContextEditor />} />
        <Tab id="env" title="Environment" panel={<EnvironmentEditor />} />
      </Tabs>
      
      
      {/* Move the add button to the RequestList and to the EnvironmentEditor?? */}
      <BottomBar>
        <ButtonGroup minimal={false} fill={false}>
          <Button icon="add" onClick={addClicked}>Add</Button>
          <Popover content={<EnvMenu />} >
            <Button rightIcon='caret-up' icon='eye-open' text='Environment' />
          </Popover>
        </ButtonGroup>
      </BottomBar>

    </Card>;
  }

  changeTab(tab) {
    console.log(`Changing to tab ${tab}`);
    this.setState({ tab });
  }
};

const EnvMenu = props =>
  <Menu>
    <MenuItem text='default' />
    <MenuItem text='staging' />
    <MenuItem text='production' />
  </Menu>;

// @ts-ignore
export default connect({
  containers: [requestContainer, contextContainer],
  selector: ({ containers }) => ({
    add: {
      requests: R.bind(containers[0].addNewRequest, containers[0]),
      env: R.bind(containers[1].addNewEnvironment, containers[1])
    }
  })
})(Sidebar);
