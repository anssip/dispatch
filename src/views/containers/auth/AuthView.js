import React from "react";
import { FormGroup, Text, Classes, Card, ControlGroup, HTMLSelect, InputGroup, Button, Tabs, Tab } from "@blueprintjs/core";
import styled from "styled-components";
import connect from "unstated-connect2";
import requestContainer from "../../../models/RequestContainer";

const R = require("ramda");
const Wrapper = styled.div`
  padding-top: 10px;
`;

class AuthView extends React.PureComponent {

  constructor(props) {
    super(props);
  }
  render() {
    const { authType, setAuthType } = this.props;
    return (
      <div>
        <FormGroup
          label="Type"
          labelFor="authTypeSelect"
          inline={true}
        >
          <HTMLSelect
            onChange={setAuthType}
            id="authTypeSelect"
            options={['none', 'basic', 'bearer']}
            value={authType}
            className={Classes.FIXED}
          />
        </FormGroup>
        <Wrapper>
          {/* TODO: render a type specific view based on selected type */}
        </Wrapper>
      </div>);
  }
  selectContentType(contentType) {
    this.setState({ contentType });
  }
}


// @ts-ignore
export default connect({
  container: requestContainer,
  selector: ({ container }) => ({
    setAuthType: R.compose(R.bind(container.setAuthType, container), R.prop("value"), R.prop("currentTarget")),
    authType: container.getAuthType()
  })
})(AuthView);
