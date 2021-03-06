import React, { useState } from "react";
import { ResizeSensor, Text } from "@blueprintjs/core";
import styled from "styled-components";
import connect from "unstated-connect2";
import requestContainer from "../../models/RequestContainer";
import CodeEditor from "../components/CodeEditor";

import prettify from "../../models/json-pretty";

// Show:
// 1) time it took to execute,
// 2) response status, headers
// 3) error or response body

const Wrapper = styled.div`
  height: 100%;
  padding: 10px;
`;

const Overview = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const Title = styled.div`
  padding: 10px 10px 2px 10px;
  border-bottom: 1px solid #394b59;
  font-size: 12px;
  color: #738694;
`;

const Headers = styled.div`
  padding: 10px 10px 0px 10px;
`;

const Body = styled.div`
  padding: 10px;
`;

const Header = styled.div`
  font-size: 14px;
  display: flex;
  justify-content: space-between;
`;

const HeaderName = styled.div`
  width: 40%;
`;

const HeaderValue = styled.div`
  width: 60%;
`;

const betterBodies = (body, headers) => {
  const contentType = headers["content-type"] || headers["Content-Type"];
  const doPrettify = !!(
    contentType && contentType.toLowerCase().match("application/json")
  );
  console.log(`content-type ${contentType}`);
  console.log(`prettifying? ${doPrettify}`);
  if (doPrettify) {
    try {
      return typeof body === "string"
        ? JSON.stringify(JSON.parse(body), null, 2)
        : JSON.stringify(body, null, 2);
    } catch (e) {
      console.error("Failed to parse response JSON", e);
    }
  }
  return `${body}`;
};

const ResponseView = props => {
  const [paneHeight, setPaneHeight] = useState(0);
  // TODO: render something meaningful if no response available (like Blueprint's non-ideal state)
  if (!props.response) return "";
  console.log("ResponseView", props);
  const {
    response: { response, error }
  } = props;
  if (response) {
    console.log("ResponseView rendering response", response);
  }
  const statusText = error
    ? error.message || ""
    : response
    ? response.statusCode
    : "";
  const StatusCode = styled.div`
    color: ${error || response.statusCode >= 400 ? "#F55656" : "#3DCC91"};
    border: 1px solid
      ${error || response.statusCode >= 400 ? "#F55656" : "#3DCC91"};
    padding: 4px;
    max-width: ${statusText.length + 1}em;
    text-align: center;
    border-radius: 3px;
  `;
  const handleResize = entries => {
    console.log(
      `ResponseView contentHeight = ${entries[0].contentRect.height}`
    );
    setPaneHeight(entries[0].contentRect.height);
  };

  // TODO: Add request timing and color the millisecond value if takes more than 500 ms
  return (
    <ResizeSensor onResize={handleResize}>
      <Wrapper>
        <Overview>
          {statusText !== "" ? <StatusCode>{statusText}</StatusCode> : ""}
        </Overview>
        <Title>Response headers</Title>
        <Headers>
          {response && response.headers
            ? Object.keys(response.headers).map((key, i) => (
                <Header key={i}>
                  <HeaderName>
                    <Text ellipsize={true}>{key}</Text>
                  </HeaderName>
                  <HeaderValue>
                    <Text ellipsize={true}>{response.headers[key]}</Text>
                  </HeaderValue>
                </Header>
              ))
            : ""}
        </Headers>
        <Title>Response body</Title>
        <Body>
          {response && response.body ? (
            <CodeEditor
              // TODO: separate button & menu item to trigger prerrify
              id="response"
              value={betterBodies(response.body, response.headers)}
              autoScroll={true}
              className="CodeMirror-context"
              paneHeight={paneHeight - 170}
              options={{
                mode: "javascript",
                json: true,
                lineNumbers: false,
                theme: "ttcn",
                lineWrapping: true,
                tabSize: 2,
                indentWithTabs: false,
                readOnly: true
              }}
            />
          ) : (
            ""
          )}
        </Body>
      </Wrapper>
    </ResizeSensor>
  );
};

export default connect({
  container: requestContainer,
  selector: ({ container }) => {
    return {
      response: requestContainer.getSelected().response
    };
  }
})(ResponseView);
