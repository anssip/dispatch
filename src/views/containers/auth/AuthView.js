import React from "react";
import {
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
import connect from "unstated-connect2";
import requestContainer from "../../../models/RequestContainer";
import BasicAuthForm from "./BasicAuthForm";
import OAuth2Form from "./OAuth2Form";

const R = require("ramda");
const Wrapper = styled.div`
  padding-top: 10px;
`;

const authOptions = [
  { id: "none", label: "", component: "" },
  { id: "basic", label: "Basic", component: <BasicAuthForm /> },
  { id: "bearer", label: "Bearer", component: "" },
  { id: "oAuth2", label: "OAuth 2.0", component: <OAuth2Form /> }
];

class AuthView extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const { authType, setAuthType } = this.props;
    return (
      <div>
        <FormGroup label="Type" labelFor="authTypeSelect">
          <HTMLSelect
            fill={true}
            onChange={setAuthType}
            id="authTypeSelect"
            options={R.map(R.prop("label"), authOptions)}
            value={authType}
            className={Classes.FIXED}
          />
        </FormGroup>
        <Wrapper>
          {R.find(R.propEq("id", authType))(authOptions).component}
          {/* TODO: render a type specific view based on selected type */}
        </Wrapper>
      </div>
    );
  }
  selectContentType(contentType) {
    this.setState({ contentType });
  }
}

// @ts-ignore
export default connect({
  container: requestContainer,
  selector: ({ container }) => ({
    setAuthType: R.compose(
      R.bind(container.setAuthType, container),
      R.prop("value"),
      R.prop("currentTarget")
    ),
    authType: container.getAuthType()
  })
})(AuthView);