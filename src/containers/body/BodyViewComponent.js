import React from "react";
import { ResizeSensor, TextArea, Intent, Divider, FormGroup, Text, Classes, Card, ControlGroup, HTMLSelect, InputGroup, Button, Tabs, Tab } from "@blueprintjs/core";
import styled from "styled-components";
import requests from "../../models/mock-requests";
import { Controlled as CodeMirror } from "react-codemirror2";
import connect from "unstated-connect2";
import requestContainer from "../../models/RequestContainer";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/midnight.css";
require("codemirror/mode/javascript/javascript");

const R = require("ramda");
const jsStringify = require("javascript-stringify");
const object = require("json-templater").object;
const fill = (tmpl, ...rest) => rest.reduce((acc, curr) => object(acc, curr), tmpl);

// mock data
const ctx = {
  source: {
    name: "megaman",
    value: 100,
    jdbc: "{{jdbc}}",
    password: "{{pwd}}"
  },
  tmplX: {
    foo: "{{foo}}",
    bar: "{{bar}}"
  }
};

const env = {
  jdbc: "jdbc://mydb.net"
}

const Wrapper = styled.div`
`;

class BodyViewComponent extends React.Component {
  constructor(props) {
    super(props);
    const { request, setBody } = this.props;
    console.log("================  CREATING BODY VIEW =====================", request);
    this.state = { value: request.body };

    // this.state = { value: request.body };

    console.log(request.body);
  }
  render() {
    console.log(this.props);
    const { request, setBody } = this.props;
    const width = `${this.props.paneWidth - 41}px`;
    console.log(
      "================  BODY VIEW RENDER =====================",
      request
    );
    //console.log(`Body: ${width}`);
  
    return (
      <Wrapper>
        <CodeMirror
          value={request.body}
          options={{
            mode: "javascript",
            lineNumbers: true,
            theme: "midnight"
          }}
          onBeforeChange={(editor, data, value) => {
            console.log("onBeforeChange");


            // TODO: handle the evaluation outside of state. In the preview generation only.
            this.setState({ value: `let x = ${value}; x;` });
            
            setBody(request, this.state.value);
          }}
          onChange={(editor, data, value) => {
            console.log("onChange");
            // setBody(request, this.state.value);
          }}
        />
        <TextArea
          large={true}
          defaultValue={this.getPreview(request)}
          fill={true}
          style={{ marginTop: "10px", height: "200px", width, maxWidth: width, minWidth: width }}
        />
      </Wrapper>);

  }

  getPreview(request) {
    const value = this.state.value || request.body;
    // @ts-ignore
    try {

      if (value.indexOf("let x") < 0) {
        return fill(value, env);
      } 
      return JSON.stringify((eval(fill(value, env))), null, 2);
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}

// @ts-ignore
export default connect({
  container: requestContainer,
  selector: ({ container }) => ({
    request: container.getSelected(),
    setBody: R.bind(container.setBody, container)
  })
})(BodyViewComponent);
