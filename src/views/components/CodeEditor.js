import React from "react";
import { Controlled as CodeMirrorComponent } from "react-codemirror2";
import CodeMirror from "codemirror";

import "codemirror/mode/javascript/javascript";
import jinja2 from "codemirror/mode/jinja2/jinja2";

import "codemirror/addon/display/autorefresh";
import "codemirror/addon/dialog/dialog";
import "codemirror/addon/dialog/dialog.css";
import "codemirror/addon/fold/foldcode";
import "codemirror/addon/fold/foldgutter";
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/brace-fold";
import "codemirror/addon/fold/comment-fold";
import "codemirror/addon/fold/indent-fold";
import "codemirror/addon/fold/xml-fold";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/comment/comment";
import "codemirror/addon/search/search";
import "codemirror/addon/search/searchcursor";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/search/matchesonscrollbar";
import "codemirror/addon/search/matchesonscrollbar.css";
import "codemirror/addon/selection/active-line";
import "codemirror/addon/selection/selection-pointer";
import "codemirror/addon/display/placeholder";
import "codemirror/addon/mode/overlay";

import "codemirror/addon/lint/lint";
import "codemirror/addon/lint/json-lint";
import "codemirror/addon/lint/lint.css";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/ttcn.css";

const jsonlint = require("jsonlint-mod").parser;
window.jsonlint = jsonlint;

CodeMirror.defineExtension("dispatchTags", function() {
  console.log("In dispatch extension");
  this.on("change", (cm, change) => {
    console.log("CodeMirror.change", cm.getValue());

    const viewport = this.getViewport();
    for (let line = viewport.from; line < viewport.to; line++) {
      const tokens = this.getLineTokens(line);
      console.log("CodeMirror.tokens", tokens);
    }
    // loop through this.getViewport() and set marks for all {{}} occurrences
  });
});

CodeMirror.defineMode("dispatch", (config, parserConfig) => {
  const baseMode = CodeMirror.getMode(
    config,
    parserConfig.baseMode || "text/plain"
  );
  return CodeMirror.overlayMode(baseMode, customTagsMode(), false);
});

function customTagsMode() {
  const variableRegex = /^{{\s*([^ }]+)\s*[^}]*\s*}}/;
  const tagRegex = /^{%\s*([^ }]+)\s*[^%]*\s*%}/;

  return {
    startState() {
      return {};
    },
    token(stream, state) {
      if (stream.match(tagRegex, true)) {
        return `dispatch-tag`;
      }
      if (stream.match(variableRegex, true)) {
        return `dispatch-variable`;
      }
      while (stream.next() != null) {
        if (stream.match(variableRegex, false)) break;
        if (stream.match(tagRegex, false)) break;
      }
      return null;
    }
  };
}

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
      <CodeMirrorComponent
        editorDidMount={editor => {
          this[this.props.id] = editor;
          editor.setOption("lint", true);
          editor.dispatchTags();
        }}
        {...this.props}
        key={this.props.id}
      />
    );
  }

  resize() {
    const height = `${this.props.paneHeight}px`;
    console.log(`CodeEditor ${this.props.id}, setting size to ${height}`);
    this[this.props.id].setSize("100%", height);
  }

  componentDidMount() {
    console.log(`CodeEditor.componentDidMount`);
    this.resize();
  }

  componentDidUpdate() {
    // console.log(
    //   `CodeEditor.componentDidUpdate:: ${this.props.id} paneHeight ${
    //     this.props.paneHeight
    //   }px`,
    //   this[this.props.id]
    // );
    this.resize();
  }
}

export default CodeEditor;
