import React from "react";
import { Card, Tab, Tabs, ButtonGroup, Button, Popover, Menu, MenuItem } from "@blueprintjs/core";
import styled from "styled-components";
import SidebarList from './SidebarList';
import connect from 'unstated-connect2';
import requestContainer from '../models/RequestContainer';

// TODO: add this
//import contextContainer from '../models/ContextContainer';

const R = require('ramda');

const BottomBar = styled.div`
  position: fixed;
  bottom: 0;
`;

// const Sidebar = props => renderRequests(props.requests);
const Sidebar = ({ container, addRequest }) =>
  <Card className='left-pane'>
    <Tabs id="sidebarTabs" onChange={_ => console.log('tab changed')} defaultSelectedTabId="requests">
      <Tab id="requests" title="Requests" panel={<SidebarList container={container}/>} />
      <Tab id="templates" title="Context" />
    </Tabs>
    <BottomBar>
      <ButtonGroup minimal={false} fill={false}>
        <Button icon="add" onClick={ addRequest }>Add</Button>
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

// @ts-ignore
export default connect({
  container: requestContainer,
  selector: ({ container }) => ({
    container,
    addRequest: R.bind(container.addRequest, container)
  })
})( Sidebar );
