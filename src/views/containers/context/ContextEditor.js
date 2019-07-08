import React from "react";
import {
  Popover,
  Button,
  ButtonGroup,
  Drawer,
  Position
} from "@blueprintjs/core";
import styled from "styled-components";
import connect from "unstated-connect2";
import container from "../../../models/ContextContainer";
import CodeEditor from "../../components/CodeEditor";

const R = require("ramda");

const Wrapper = styled.div`
  height: 100%;
  margin-left: -12px;
  margin-right: -4px;
`;

class ContextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
  }
  render() {
    const { value, setValue, paneHeight } = this.props;
    console.log(`ContextEditor, value == ${JSON.stringify(value)}`);

    return (
      <Wrapper>
        <Button
          style={{
            zIndex: 10,
            position: "absolute",
            top: 70,
            right: 5
          }}
          icon="fullscreen"
          small={true}
          onClick={R.bind(this.expand, this)}
        />

        {this.renderEditor("context-1", value, setValue, paneHeight)}

        <Drawer
          transitionName=""
          usePortal={true}
          transitionDuration={0}
          size={Drawer.SIZE_LARGE}
          icon="info-sign"
          onClose={R.bind(this.collapse, this)}
          title="Context"
          {...this.state}
        >
          {this.renderEditor("context-2", value, setValue, paneHeight)}
        </Drawer>
      </Wrapper>
    );
  }

  renderEditor(key, value, setValue, paneHeight) {
    return (
      <CodeEditor
        // TODO: separate button & menu item to trigger prerrify
        id={key}
        paneHeight={paneHeight}
        value={value}
        autoScroll={true}
        className="CodeMirror-context"
        options={{
          gutters: ["CodeMirror-lint-markers"],
          // mode: { name: "dispatch", baseMode: "application/json" },
          mode: "application/json",
          theme: "ttcn",
          lint: true,
          // mode: "application/json",
          lineNumbers: true,
          placeholder: "Your request body goes here...",
          foldGutter: true,
          height: "auto",
          autoRefresh: 2000,
          lineWrapping: false,
          scrollbarStyle: "native",
          matchBrackets: true,
          // autoCloseBrackets: true,
          tabSize: 2,
          indentUnit: 2,
          hintOptions: null,
          dragDrop: true,
          viewportMargin: 30, // default 10
          selectionPointer: "default",
          styleActiveLine: true,
          indentWithTabs: true,
          showCursorWhenSelecting: false,
          cursorScrollMargin: 12, // NOTE: This is px
          keyMap: "default"
        }}
        onBeforeChange={(editor, data, value) => {
          console.log("onBeforeChange");
          // this.setState({ value });
          setValue(value);
        }}
        onChange={(editor, data, value) => {
          console.log("onChange");
        }}
      />
    );
  }

  expand() {
    this.setState({ isOpen: true });
  }
  collapse() {
    this.setState({ isOpen: false });
  }
}

// @ts-ignore
export default connect({
  container,
  selector: ({ container, paneHeight }) => ({
    paneHeight,
    value: container.getValue(),
    setValue: R.bind(container.setValue, container)
    // addContext: R.bind(container.addContext, container)
  })
})(ContextEditor);
