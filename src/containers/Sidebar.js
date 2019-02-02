import React from "react";
import { Tab, Tabs } from "@blueprintjs/core";
import styled from "styled-components";

import RequestPanel from './RequestPanel';

// const Sidebar = props => renderRequests(props.requests);
const Sidebar = props =>
  <Tabs id="sidebarTabs" onChange={_=> console.log('tab changed')} defaultSelectedTabId="requests">
    <Tab id="requests" title="Requests" panel={<RequestPanel requests={props.requests}/>} />
    <Tab id="templates" title="Templates" />
    <Tab id="environments" title="Environments" />
  </Tabs>;

export default Sidebar;
