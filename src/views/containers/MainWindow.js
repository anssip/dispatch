import React from "react";
import connect from "unstated-connect2";
import SplitPane from "react-split-pane";
import Sidebar from "./Sidebar";
import "./splitpane.css";
import RequestView from "./RequestView";
import ResponseView from "./ResponseView";
import AuthView from "./auth/AuthView";
import {
  ResizeSensor,
  Card,
  TextArea,
  Button,
  Tooltip,
  Position,
  Popover,
  Menu,
  MenuItem
} from "@blueprintjs/core";
import requestContainer from "../../models/RequestContainer";
import contextContainer from "../../models/ContextContainer";
import projectContainer from "../../models/ProjectContainer";
import authContainer from "../../models/AuthContainer";
import styled from "styled-components";

const R = require("ramda");

const Preview = styled.div`
  padding: 10px;
  word-wrap: break-all;
  overflow: visible;
`;

const Buttons = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
`;

const ExportMenu = props => (
  <Menu>
    <MenuItem text="Copy" />
    <MenuItem text="Export..." />
  </Menu>
);

class MainWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = { paneWidth: 0, paneHeight: 0 };
  }

  render() {
    const { request, preview, activeSidebarTab } = this.props;

    return request ? (
      <ResizeSensor onResize={entries => this.handleWrapperResize(entries)}>
        <SplitPane
          className="bp3-dark"
          split="vertical"
          minSize={200}
          defaultSize={350}
        >
          <Sidebar />

          <SplitPane
            className="bp3-dark"
            split="vertical"
            primary="second"
            defaultSize={270}
          >
            <SplitPane
              className="bp3-dark"
              split="horizontal"
              primary="second"
              minSize={0}
              defaultSize={200}
            >
              {activeSidebarTab === "methods" ? (
                <AuthView />
              ) : (
                <RequestView
                  paneWidth={this.state.paneWidth}
                  paneHeight={this.state.contentHeight - this.state.paneHeight}
                />
              )}
              <ResizeSensor onResize={entries => this.handleResize(entries)}>
                {/* <Preview>{preview}</Preview> */}
                <>
                  <TextArea
                    value={preview}
                    fill={true}
                    readOnly={true}
                    style={{
                      margin: 0,
                      width: "100%",
                      color: "#8A9BA8",
                      fontSize: 13,
                      resize: "none"
                    }}
                  />
                  <Buttons>
                    {/* <Popover>
                      <Tooltip
                        content="Copy to clipboard"
                        position={Position.BOTTOM}
                      >
                        <Button icon="export" onClick={() => {}} />
                      </Tooltip>
                    </Popover> */}
                    <Popover content={<ExportMenu />}>
                      <Button icon="export" />
                    </Popover>
                  </Buttons>
                </>
              </ResizeSensor>
            </SplitPane>
            <ResponseView />
          </SplitPane>
        </SplitPane>
      </ResizeSensor>
    ) : (
      <Card>Open a project first!</Card>
    );
  }

  handleResize(entries) {
    this.setState({
      paneWidth: entries[0].contentRect.width,
      paneHeight: entries[0].contentRect.height
    });
  }
  handleWrapperResize(entries) {
    this.setState({
      contentHeight: entries[0].contentRect.height,
      contentWidth: entries[0].contentRect.width
    });
  }
}

// @ts-ignore
export default connect({
  containers: [
    requestContainer,
    contextContainer,
    projectContainer,
    authContainer
  ],
  selector: ({ containers }) => {
    return {
      request: requestContainer.getSelected(),
      preview: requestContainer.getPreview(
        contextContainer.getValue(),
        contextContainer.getSelectedEnvironment(),
        authContainer.getMethods()
      ),
      activeSidebarTab: projectContainer.getActiveSidebarTab()
    };
  }
})(MainWindow);
