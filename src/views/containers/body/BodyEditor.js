import React from "react";
import styled from "styled-components";
import connect from "unstated-connect2";
import requestContainer from "../../../models/RequestContainer";
import CodeEditor from "../../components/CodeEditor";

const JSON_SPACE = 2;
const prettify = jsonText => {
  try {
    return JSON.stringify(JSON.parse(jsonText), null, JSON_SPACE);
  } catch (e) {
    return jsonText;
  }
};

const R = require("ramda");

const Wrapper = styled.div`
  margin-left: -20px;
  margin-right: -20px;
`;

class BodyEditor extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log(this.props);
    const { request, setBody, paneHeight, paneWidth } = this.props;

    return (
      <Wrapper>
        <CodeEditor
          id="body"
          paneHeight={paneHeight - 232}
          value={request.body}
          onBeforeChange={(editor, data, value) => {
            console.log("CodeEditor, onBeforeChange", value);
            // this.setState({ value });
            setBody(value);
          }}
          onChange={(editor, data, value) => {
            console.log("onChange");
            // setBody(value);
          }}
          options={{
            gutters: ["CodeMirror-lint-markers"],
            lint: true,
            mode: "application/json",
            lineNumbers: true,
            placeholder: "Your request body goes here...",
            foldGutter: true,
            height: "auto",
            autoRefresh: 2000,
            lineWrapping: false,
            scrollbarStyle: "native",
            matchBrackets: true,
            autoCloseBrackets: true,
            tabSize: 2,
            indentUnit: 2,
            hintOptions: null,
            dragDrop: true,
            viewportMargin: 30, // default 10
            selectionPointer: "default",
            styleActiveLine: true,
            indentWithTabs: true,
            showCursorWhenSelecting: false,
            cursorScrollMargin: 12, // NOTE: This is px
            keyMap: "default"
          }}
        />
      </Wrapper>
    );
  }
}

// @ts-ignore
export default connect({
  container: requestContainer,
  selector: ({ container, paneHeight, paneWidth }) => ({
    paneHeight,
    paneWidth,
    request: container.getSelected(),
    setBody: R.bind(container.setBody, container)
  })
})(BodyEditor);
