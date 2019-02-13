import React from "react";
import { FormGroup, Text, Classes, Card, ControlGroup, HTMLSelect, InputGroup, Button, Tabs, Tab } from "@blueprintjs/core";
import styled from "styled-components";
import connect from 'unstated-connect2';
import container from "../../models/ContextContainer";
import CodeEditor from "../../components/CodeEditor";
import jsonPrettify from "../../models/json-pretty";

const R = require("ramda");

const ContextEditor = ({ value, setValue }) => {
  console.log(`rendering context ${value}`);

  return <Wrapper>
    <CodeEditor
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
    />

  </Wrapper>;
}


const Wrapper = styled.div`
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
