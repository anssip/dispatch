import React from "react";
import { Popover, Button, ButtonGroup, Drawer, Position } from "@blueprintjs/core";
import styled from "styled-components";
import connect from 'unstated-connect2';
import container from "../../../models/ContextContainer";
import CodeEditor from "../../components/CodeEditor";
import jsonPrettify from "../../../models/json-pretty";

const R = require("ramda");


class ContextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false }
  }
  render() {
    const { value, setValue } = this.props;
    console.log(`rendering context ${value}`);

    return <Wrapper>
      <Toolbar>
        <ButtonGroup style={{}} minimal={false} fill={false}>
          <Button style={{ position: "absolute", top: 20, right: 0, backgroundColor: "#000" }} icon="fullscreen" small={true} onClick={R.bind(this.expand, this)} />
        </ButtonGroup>
      </Toolbar>

      {this.renderEditor(value, setValue)}

      <Drawer 
        className="bp3-dark"
        transitionName=""
        usePortal={true}
        transitionDuration={0}
        size={Drawer.SIZE_STANDARD}
        icon="info-sign"
        onClose={R.bind(this.collapse, this)}
        title="Context"
        {...this.state}
      >
        {this.renderEditor(value, setValue)}
      </Drawer>
    </Wrapper>
  }

  renderEditor(value, setValue) {
    return <CodeEditor
      value={jsonPrettify(value)}
      autoScroll={true}
      options={{
        mode: "javascript",
        json: true,
        lineNumbers: false,
        theme: "midnight",
        lineWrapping: false
      }}
      onBeforeChange={(editor, data, value) => {
        console.log("onBeforeChange");
        // this.setState({ value });            
        setValue(value);
      }}
      onChange={(editor, data, value) => {
        console.log("onChange");
      }}
    />;
  }

  expand() {
    this.setState({ isOpen: true });
  }
  collapse() {
    this.setState({ isOpen: false });
  }
};

const Wrapper = styled.div`
`;

const Toolbar = styled.div`
  position: relative
`;

// @ts-ignore
export default connect({
  container,
  selector: ({ container }) => ({
    value: container.getValue(),
    setValue: R.bind(container.setValue, container)
    // addContext: R.bind(container.addContext, container)
  })
})(ContextEditor);
