import React from "react";
import { ResizeSensor, TextArea, Intent, Divider, FormGroup, Text, Classes, Card, ControlGroup, HTMLSelect, InputGroup, Button, Tabs, Tab } from "@blueprintjs/core";
import styled from "styled-components";
import { Controlled as CodeMirror } from "react-codemirror2";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/midnight.css";
require("codemirror/mode/javascript/javascript");


class CodeEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(`CodeEditor:: paneHeight ${this.props.paneHeight}px`);
    return <CodeMirror editorDidMount={editor => { this.instance = editor }} {...this.props} />
  }

  componentDidUpdate() {
    const height = `${this.props.paneHeight - 250}px`;
    // console.log(`CodeEditor, setting size to ${height}`);
    this.instance.setSize('100%', height);
  }  
}

export default CodeEditor;