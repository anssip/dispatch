import React from "react";
import { Card, Tab, Tabs, ButtonGroup, Button, Popover, Menu, MenuItem } from "@blueprintjs/core";
import styled from "styled-components";
import RequestPanel from './RequestPanel';

const BottomBar = styled.div`
  position: fixed;
  bottom: 0;
`;

// const Sidebar = props => renderRequests(props.requests);
const Sidebar = props =>
  <Card className='left-pane'>
    <Tabs id="sidebarTabs" onChange={_ => console.log('tab changed')} defaultSelectedTabId="requests">
      <Tab id="requests" title="Requests" panel={<RequestPanel requests={props.requests} />} />
      <Tab id="templates" title="Templates" />
    </Tabs>
    <BottomBar>
      <ButtonGroup minimal={false} fill={false}>
        <Button icon="add">Add</Button>
        <Popover content={ <EnvMenu />} >
          <Button rightIcon='caret-up' icon='eye-open' text='Environment' />
        </Popover>
      </ButtonGroup>
    </BottomBar>
  </Card>;

const EnvMenu = props =>
  <Menu>
    <MenuItem text='default' />
    <MenuItem text='staging' />
    <MenuItem text='production' />
  </Menu>;


export default Sidebar;
