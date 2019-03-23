import React from "react";
import styled from "styled-components";
import connect from "unstated-connect2";
import requestContainer from "../../../models/RequestContainer";
import CodeEditor from "../../components/CodeEditor";

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
          paneHeight={paneHeight}
          value={request.body}
          options={{
            mode: "javascript",
            lineNumbers: true,
            theme: "midnight"
          }}
          onBeforeChange={(editor, data, value) => {
            console.log("CodeEditor, onBeforeChange", value);
            // this.setState({ value });
            setBody(value);
          }}
          onChange={(editor, data, value) => {
            console.log("onChange");
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
