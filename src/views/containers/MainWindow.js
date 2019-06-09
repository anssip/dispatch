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
  NonIdealState,
  TextArea,
  Button,
  Popover,
  Menu,
  MenuItem,
  FocusStyleManager
} from "@blueprintjs/core";
import requestContainer from "../../models/RequestContainer";
import contextContainer from "../../models/ContextContainer";
import projectContainer from "../../models/ProjectContainer";
import authContainer from "../../models/AuthContainer";
import styled from "styled-components";

FocusStyleManager.onlyShowFocusOnTabs();

const { clipboard, remote } = window.require("electron");
const R = require("ramda");

const Buttons = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
`;

class MainWindow extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { paneWidth: 0, paneHeight: 0 };
    this.copyToClipboard = R.bind(this.copyToClipboard, this);
    this.export = R.bind(this.export, this);
  }

  copyToClipboard() {
    clipboard.writeText(this.props.preview);
  }

  export() {
    remote
      .getCurrentWindow()
      .webContents.send(
        "export-request",
        `${this.props.request.name.replace(/ /g, "-")}.sh`,
        this.props.preview
      );
  }

  render() {
    const { method, preview, activeSidebarTab } = this.props;

    return (
      <ResizeSensor onResize={entries => this.handleWrapperResize(entries)}>
        <SplitPane
          className="bp3-light"
          split="vertical"
          minSize={200}
          defaultSize={350}
        >
          <Sidebar />
          {/* TODO: hide preview pane using a toggle button */}
          <SplitPane
            className="bp3-light"
            split="vertical"
            primary="second"
            defaultSize={270}
          >
            <SplitPane
              className="bp3-light"
              split="horizontal"
              primary="second"
              minSize={0}
              defaultSize={200}
            >
              {activeSidebarTab === "methods" ? (
                method && method.name ? (
                  <AuthView />
                ) : (
                  <NonIdealState
                    icon="add-to-artifact"
                    title="No authentication methods"
                    description={
                      <>
                        Add a new method by clicking the <strong>Add</strong>{" "}
                        button on the left-hand pane.
                      </>
                    }
                  />
                )
              ) : (
                <RequestView
                  paneWidth={this.state.paneWidth}
                  paneHeight={this.state.contentHeight - this.state.paneHeight}
                />
              )}
              <ResizeSensor onResize={entries => this.handleResize(entries)}>
                <>
                  <TextArea
                    value={preview}
                    fill={true}
                    readOnly={true}
                    style={{
                      margin: 0,
                      width: "100%",
                      color: "#333",
                      fontSize: 13,
                      resize: "none"
                    }}
                  />
                  <Buttons>
                    <Popover
                      content={
                        <Menu>
                          <MenuItem
                            text="Copy"
                            onClick={this.copyToClipboard}
                          />
                          <MenuItem text="Export..." onClick={this.export} />
                        </Menu>
                      }
                    >
                      <Button icon="export" />
                    </Popover>
                  </Buttons>
                </>
              </ResizeSensor>
            </SplitPane>

            {/* TODO: hide the response pane using a toggle button */}
            <ResponseView />
          </SplitPane>
        </SplitPane>
      </ResizeSensor>
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
      method: authContainer.getSelected(),
      preview: requestContainer.getPreview(
        contextContainer.getValue(),
        contextContainer.getSelectedEnvironment(),
        authContainer.getMethods()
      ),
      activeSidebarTab: projectContainer.getActiveSidebarTab()
    };
  }
})(MainWindow);
