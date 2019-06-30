import React from "react";
import { Controlled as CodeMirrorComponent } from "react-codemirror2";
import CodeMirror from "codemirror";

import "codemirror/mode/javascript/javascript";

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

    // loop through this.getViewport() and set marks for all {{}} occurrences
  });
});

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
