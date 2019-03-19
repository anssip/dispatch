import React from "react";
import {
  Card,
  Tab,
  Tabs,
  ButtonGroup,
  Button,
  Popover,
  Menu,
  MenuItem
} from "@blueprintjs/core";
import styled from "styled-components";
import SidebarList from "./SidebarList";
import ContextEditor from "./context/ContextEditor";
import EnvironmentEditor from "./EnvironmentEditor";
import connect from "unstated-connect2";
import requestContainer from "../../models/RequestContainer";
import contextContainer from "../../models/ContextContainer";
import authContainer from "../../models/AuthContainer";
import projectContainer from "../../models/ProjectContainer";
import Request from "../components/Request";
import AuthMethod from "../components/AuthMethod";

const R = require("ramda");

const BottomBar = styled.div`
  position: fixed;
  bottom: 0;
`;

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      activeTab,
      setActiveTab,
      add,
      selectEnv,
      addEnv,
      environments,
      selectedEnv,
      requests,
      selectRequest,
      methods,
      selectMethod
    } = this.props;
    console.log(`Sidebar: selectedEnv: ${selectEnv}`);

    const addClicked = () => {
      if (activeTab === "context") {
        setActiveTab("requests");
        add.requests();
      } else {
        add[activeTab]();
      }
    };

    return (
      <Card className="left-pane">
        <Tabs
          id="sidebarTabs"
          onChange={setActiveTab}
          renderActiveTabPanelOnly={true}
          selectedTabId={activeTab}
        >
          <Tab
            id="requests"
            title="Requests"
            panel={
              <SidebarList
                items={requests}
                render={(request, i) => (
                  <Request
                    handleClick={R.partial(selectRequest, [i])}
                    id={i}
                    model={request}
                  />
                )}
              />
            }
          />
          <Tab id="context" title="Context" panel={<ContextEditor />} />
          <Tab id="env" title="Variables" panel={<EnvironmentEditor />} />
          <Tab
            id="methods"
            title="Auth"
            panel={
              <SidebarList
                items={methods}
                render={(method, i) => (
                  <AuthMethod
                    handleClick={R.partial(selectMethod, [i])}
                    id={i}
                    model={method}
                  />
                )}
              />
            }
          />
        </Tabs>

        {/* Move the add button to the RequestList and to the EnvironmentEditor?? */}
        <BottomBar>
          <ButtonGroup minimal={false} fill={false}>
            <Button icon="add" onClick={addClicked}>
              Add
            </Button>
            <Popover
              content={
                <EnvMenu items={environments} add={addEnv} select={selectEnv} />
              }
            >
              <Button rightIcon="caret-up" icon="eye-open" text={selectedEnv} />
            </Popover>
          </ButtonGroup>
        </BottomBar>
      </Card>
    );
  }
}

const EnvMenu = props => (
  <Menu>
    {props.items.map((e, i) => (
      <MenuItem
        text={typeof e == "string" ? e : ""}
        onClick={R.partial(props.select, [i])}
      />
    ))}
    <MenuItem text="Add new environment" onClick={props.add} />
  </Menu>
);

// @ts-ignore
export default connect({
  containers: [
    requestContainer,
    contextContainer,
    authContainer,
    projectContainer
  ],
  selector: ({ containers }) => ({
    activeTab: containers[3].getActiveSidebarTab(),
    setActiveTab: R.bind(containers[3].setActiveSidebarTab, containers[3]),
    requests: containers[0].getRequests(),
    selectRequest: R.bind(containers[0].select, containers[0]),
    methods: containers[2].getMethods(),
    selectMethod: R.bind(containers[2].select, containers[2]),
    add: {
      requests: R.bind(containers[0].addNewRequest, containers[0]),
      env: R.bind(containers[1].addEmptyVariable, containers[1]),
      methods: R.bind(containers[2].addNewMethod, containers[2])
    },
    selectEnv: R.bind(containers[1].selectEnv, containers[1]),
    selectedEnv:
      containers[1].getSelectedEnvName() || containers[1].getFirstEnvName(),
    addEnv: R.bind(containers[1].addNewEnvironment, containers[1]),
    environments: containers[1].getEnvs()
  })
})(Sidebar);
