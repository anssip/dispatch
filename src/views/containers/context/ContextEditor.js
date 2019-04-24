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
import jsonPrettify from "../../../models/json-pretty";

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
            right: 5,
            backgroundColor: "#000"
          }}
          icon="fullscreen"
          small={true}
          onClick={R.bind(this.expand, this)}
        />

        {this.renderEditor("context-1", value, setValue, paneHeight)}

        <Drawer
          className="bp3-dark"
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
    console.log("renderEditor", value);
    return (
      <CodeEditor
        // TODO: separate button & menu item to trigger prerrify
        id={key}
        paneHeight={paneHeight}
        value={value}
        autoScroll={true}
        className="CodeMirror-context"
        options={{
          mode: "javascript",
          json: true,
          lineNumbers: false,
          theme: "context",
          lineWrapping: false,
          tabSize: 2,
          indentWithTabs: false,
          //          electricChars: false,
          //          smartIndent: false,
          extraKeys: {
            Tab: function(cm) {
              var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
              cm.replaceSelection(spaces, "end", "+input");
            }
          }
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
