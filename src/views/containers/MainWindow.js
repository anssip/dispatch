import React from "react";
import connect from "unstated-connect2";
import SplitPane from "react-split-pane";
import Sidebar from "./Sidebar";
import "./splitpane.css";
import RequestView from "./RequestView";
import AuthView from "./auth/AuthView";
import { ResizeSensor, Card, TextArea } from "@blueprintjs/core";
import requestContainer from "../../models/RequestContainer";
import contextContainer from "../../models/ContextContainer";
import projectContainer from "../../models/ProjectContainer";
import authContainer from "../../models/AuthContainer";

const R = require("ramda");

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
              minSize={200}
              defaultSize={200}
            >
              {activeSidebarTab === "requests" ? (
                <RequestView
                  paneWidth={this.state.paneWidth}
                  paneHeight={this.state.contentHeight - this.state.paneHeight}
                />
              ) : (
                <AuthView />
              )}
              <ResizeSensor onResize={entries => this.handleResize(entries)}>
                <TextArea
                  large={true}
                  value={preview}
                  // defaultValue={preview}
                  fill={true}
                  style={{ margin: 0, width: "100%" }}
                />
              </ResizeSensor>
            </SplitPane>
            <Card>Response pane</Card>
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
    this.setState({ contentHeight: entries[0].contentRect.height });
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
        authContainer.getSelected()
      ),
      activeSidebarTab: projectContainer.getActiveSidebarTab()
    };
  }
})(MainWindow);
