import React from "react";
import { Classes, Card, Text } from "@blueprintjs/core";
import styled from "styled-components";
import connect from "unstated-connect2";
import requestContainer from "../../models/RequestContainer";

// Show:
// 1) time it took to execute,
// 2) response status, headers
// 3) error or response body

const Overview = styled.div`
  display: flex;
  justify-content: space-around;
`;

const Title = styled.div`
  padding: 10px 10px 2px 10px;
  border-bottom: 1px solid #a7b6c2;
  font-size: 12px;
  color: #a7b6c2;
`;

const Headers = styled.div`
  padding: 10px 10px 0px 10px;
`;

const Body = styled.div`
  padding: 10px;
`;

const Header = styled.div`
  border-bottom: 1px solid #8a9ba8;
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

const ResponseView = props => {
  // TODO: render something meaningful if no response available (like Blueprint's non-ideal state)
  if (!props.response) return "";

  const {
    response: { response, error }
  } = props;
  if (response) {
    console.log("ResponseView rendering response", response);
  }

  const StatusCode = styled.div`
    color: ${response.statusCode >= 400 ? "#F55656" : "#3DCC91"};
    border: 1px solid ${response.statusCode >= 400 ? "#F55656" : "#3DCC91"};
    padding: 4px;
    width: 4em;
    text-align: center;
    border-radius: 3px;
  `;

  // TODO: Add request timing and color the millisecond value if takes more than 500 ms
  return (
    <>
      <Overview>
        <Text>200 ms</Text>
        <StatusCode>{response.statusCode}</StatusCode>
      </Overview>
      <Title>Response headers</Title>
      <Headers>
        {Object.keys(response.headers).map((key, i) => (
          <Header key={i}>
            <HeaderName>
              <Text ellipsize={true}>{key}</Text>
            </HeaderName>
            <HeaderValue>
              <Text ellipsize={true}>{response.headers[key]}</Text>
            </HeaderValue>
          </Header>
        ))}
      </Headers>

      {/* 
      
      TODO: check if content-type: application/json --> render as pretty JSON
      headers & body should be in a separate fields/boxes 

      Use the freaking codemirror Editor here and set it to readOnly: true
      
      */}
      <Title>Response body</Title>
      <Body>
        <Text>{response.body}</Text>
      </Body>
    </>
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
