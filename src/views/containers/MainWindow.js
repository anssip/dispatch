import React from 'react';
import styled from 'styled-components';
import SplitPane from 'react-split-pane';
import Sidebar from './Sidebar';
import './splitpane.css';
import RequestView from './RequestView';
import { ResizeSensor } from "@blueprintjs/core";

// const ipc = window.require('electron').ipcRenderer;

const R = require('ramda');

const DetailPanel = styled.div`
  position: relative;
  padding: 5px 10px 0 10px;
  margin: 0px 10px 0 10px;
  width: 100%;
`;

class MainWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = { paneWidth: 0 };
  }

  render() {
    return (
      <div>
        <SplitPane className="bp3-dark" split="vertical" minSize={200} defaultSize={270}>
          <Sidebar />

          <ResizeSensor onResize={entries => this.handleResize(entries)}>
            <RequestView paneWidth={this.state.paneWidth} />
          </ResizeSensor>
        </SplitPane>
      </div>
    );

  }

  handleResize(entries) {
    console.log(`right pane width: ${entries[0].contentRect.width}`);
    this.setState({ paneWidth: entries[0].contentRect.width });
  }

}

export default MainWindow;