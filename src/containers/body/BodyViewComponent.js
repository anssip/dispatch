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
  ctx: {
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
  }
};

const env = {
  jdbc: "jdbc://mydb.net",
  pwd: "password-from-env"
}

const Wrapper = styled.div`
`;

class BodyViewComponent extends React.Component {
  constructor(props) {
    super(props);
    const { request, setBody } = this.props;
  }
  render() {
    console.log(this.props);
    const { request, setBody } = this.props;
    const width = `${this.props.paneWidth - 41}px`;

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
            // this.setState({ value });            
            setBody(request, value);
          }}
          onChange={(editor, data, value) => {
            console.log("onChange");
          }}
        />
        <TextArea
          large={true}
          value={this.getPreview(request.body)}
          defaultValue={this.getPreview(request.body)}
          fill={true}
          style={{ marginTop: "10px", height: "200px", width, maxWidth: width, minWidth: width }}
        />
      </Wrapper>);

  }
  evalBody(value) {
    let tmpValue = value.trim();
    // tmpValue = tmpValue.indexOf('{') === 0 ? JSON.stringify(value) : value;

    tmpValue = `let __x = ${tmpValue}; __x;`;
    console.log(`about to eval`, tmpValue);
    tmpValue = eval(tmpValue);
    console.log(`afer eval`, tmpValue);
    return tmpValue;
  }

  getPreview(value) {
    // @ts-ignore
    try {
      console.log(`======> about to fill`, value);

      // let tmpValue = this.evalBody(value);
      // console.log(`afer initial eval`, tmpValue);

      const tmpValue = fill(JSON.parse(value), ctx, env);
      console.log(`after ctx fill`, tmpValue);

      const result = JSON.stringify((tmpValue), null, 2);
      console.log(`result ${JSON.stringify(result)}`);

      return result;
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
