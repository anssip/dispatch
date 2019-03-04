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
    const { add, selectEnv, addEnv, environments } = this.props;
    console.log('Sidebar: environments', environments);

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
        <Tab id="env" title="Variables" panel={<EnvironmentEditor />} />
      </Tabs>
      
      {/* Move the add button to the RequestList and to the EnvironmentEditor?? */}
      <BottomBar>
        <ButtonGroup minimal={false} fill={false}>
          <Button icon="add" onClick={addClicked}>Add</Button>
          <Popover content={<EnvMenu items={environments} add={addEnv} select={selectEnv}  />} >
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
    {props.items.map((e, i) => <MenuItem text={e} onClick={R.partial(props.select, [i])}/>)}
    <MenuItem text='Add new environment' onClick={props.add} />
  </Menu>;

// @ts-ignore
export default connect({
  containers: [requestContainer, contextContainer],
  selector: ({ containers }) => ({
    add: {
      requests: R.bind(containers[0].addNewRequest, containers[0]),
      env: R.bind(containers[1].addEmptyVariable, containers[1])
    },
    selectEnv: R.bind(containers[1].selectEnv, containers[1]),
    addEnv: R.bind(containers[1].addNewEnvironment, containers[1]),
    environments: containers[1].getEnvs()
  })
})(Sidebar);
