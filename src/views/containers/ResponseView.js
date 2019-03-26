import React from "react";
import { Classes, Card, Text } from "@blueprintjs/core";
import styled from "styled-components";
import connect from "unstated-connect2";
import requestContainer from "../../models/RequestContainer";

// Show:
// 1) time it took to execute,
// 2) response status, headers
// 3) error or response body

const ResponseView = props => {
  // TODO: render something meaningful if no response available (like Blueprint's non-ideal state)
  if (!props.response) return "";

  const {
    response: { response, error }
  } = props;
  if (response) {
    console.log("ResponseView rendering response", response);
  }

  // TODO: check if content-type: application/json --> render as pretty JSON
  // headers & body should be in a separate fields/boxes
  return (
    <Card>
      <Text>{response.statusCode}</Text>
      <Text>{JSON.stringify(response.headers)}</Text>
      <Text>{response.body}</Text>
    </Card>
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
