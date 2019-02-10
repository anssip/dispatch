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
    // this.state = { value: null };
    const { request, setBody } = this.props;


    // should we store the body as JSON in state?
    this.state = { value: request.body };

    console.log(request.body);
  }
  render() {
    const { request, setBody } = this.props;
    const width = `${this.props.paneWidth - 41}px`;
    //console.log(`Body: ${width}`);

    return (
      <Wrapper>
        <CodeMirror
          value={JSON.stringify(request.body, null, "  ")}
          options={{
            mode: "javascript",
            lineNumbers: true,
            theme: "midnight"
          }}
          onBeforeChange={(editor, data, value) => {
            this.setState({ value: `let x = ${value}; x;` });
            console.log("onBeforeChange");
          }}
          onChange={(editor, data, value) => {
            console.log("onChange");
          }}
        />
        <TextArea
          large={true}
          onChange={e => this.handleChange(e.target.value)}
          value={this.getPreview()}
          fill={true}
          style={{ marginTop: "10px", height: "200px", width, maxWidth: width, minWidth: width }}
        />
      </Wrapper>);

  }

  getPreview() {
    console.log(this.state.value);
    // @ts-ignore
    try {

      if (this.state.value.indexOf("let x") < 0) {
        return fill(this.state.value, env);
      } 
      return JSON.stringify((eval(fill(this.state.value, env))), null, 2);
    } catch (e) {
      console.error(e);
      return null;
    }
  }
  handleChange(value) {
    this.setState({ value });
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
