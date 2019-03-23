import React from "react";
import {
  ResizeSensor,
  TextArea,
  Intent,
  Divider,
  FormGroup,
  Text,
  Classes,
  Card,
  ControlGroup,
  HTMLSelect,
  InputGroup,
  Button,
  Tabs,
  Tab
} from "@blueprintjs/core";
import styled from "styled-components";
import { Controlled as CodeMirror } from "react-codemirror2";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/midnight.css";
import "../../context-editor.css";
require("codemirror/mode/javascript/javascript");

class CodeEditor extends React.Component {
  constructor(props) {
    console.log(`CodeEditor ${props.id}`);
    super(props);
  }

  render() {
    console.log(
      `CodeEditor.render:: ${this.props.id} paneHeight ${
        this.props.paneHeight
      }px`
    );
    return (
      <CodeMirror
        editorDidMount={editor => {
          this[this.props.id] = editor;
        }}
        {...this.props}
        key={this.props.id}
      />
    );
  }

  resize() {
    const height = `${this.props.paneHeight}px`;
    // console.log(`CodeEditor, setting size to ${height}`);
    this[this.props.id].setSize("100%", height);
  }

  componentDidMount() {
    console.log(`CodeEditor.componentDidMount`);
    this.resize();
  }

  componentDidUpdate() {
    console.log(
      `CodeEditor.componentDidUpdate:: ${this.props.id} paneHeight ${
        this.props.paneHeight
      }px`,
      this[this.props.id]
    );
    this.resize();
  }
}

export default CodeEditor;
