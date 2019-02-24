import React from 'react';
import connect from 'unstated-connect2';
import SplitPane from 'react-split-pane';
import Sidebar from './Sidebar';
import './splitpane.css';
import RequestView from './RequestView';
import { ResizeSensor, Card, TextArea } from "@blueprintjs/core";
import requestContainer from '../../models/RequestContainer';
import contextContainer from '../../models/ContextContainer';

const R = require('ramda');


class MainWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = { paneWidth: 0, paneHeight: 0 };
  }

  render() {
    const { ctx, request, getContext, getPreview } = this.props;
    const paneWidth = this.state.paneWidth;
    const paneHeight = this.state.paneHeight;
    // console.log(`MainWindow:: contentHeight/paneHeight ${this.state.contentHeight}/${this.state.paneHeight}`);

    return (
      <ResizeSensor onResize={entries => this.handleWrapperResize(entries)} >
        <SplitPane className="bp3-dark" split="vertical" minSize={200} defaultSize={270}>
          <Sidebar />

          <SplitPane className="bp3-dark" split="vertical" primary="second" defaultSize={270}>
            <SplitPane className="bp3-dark" split="horizontal" primary="second" minSize={200} defaultSize={200}>
              <RequestView paneWidth={this.state.paneWidth} paneHeight={this.state.contentHeight - this.state.paneHeight} />
              <ResizeSensor onResize={entries => this.handleResize(entries)} >
                <TextArea
                  large={true}
                  value={getPreview(ctx, {}, request.body)}
                  defaultValue={getPreview(ctx, {}, request.body)}
                  fill={true}
                  style={{ margin: 0, width: "100%" }}
                />
              </ResizeSensor>
            </SplitPane>
            <Card>
              Response pane
            </Card>
          </SplitPane>

        </SplitPane>
      </ResizeSensor>
    );
  }
  handleResize(entries) {
    this.setState({ paneWidth: entries[0].contentRect.width, paneHeight: entries[0].contentRect.height });
  }
  handleWrapperResize(entries) {
    this.setState({ contentHeight: entries[0].contentRect.height });
  }
}

// @ts-ignore
export default connect({
  containers: [requestContainer, contextContainer],
  selector: ({ containers }) => ({
    request: containers[0].getSelected(),
    getPreview: R.bind(containers[0].getPreview, containers[0]),
    ctx: containers[1].getValue()
  })
})(MainWindow);
