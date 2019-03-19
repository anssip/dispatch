import React from "react";
import {
  EditableText,
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
import authContainer from "../../../models/AuthContainer";
import BasicAuthForm from "./BasicAuthForm";
import OAuth2Form from "./OAuth2Form";
import withValueChangeDetection from "../../components/Input";

const R = require("ramda");
const Wrapper = styled.div`
  padding-top: 10px;
`;
const NameWrapper = styled.h2`
  margin-top: 10px;
  text-align: left;
`;

const authOptions = [
  { type: "none", label: "none", component: "" },
  { type: "basic", label: "Basic", component: <BasicAuthForm /> },
  { type: "bearer", label: "Bearer", component: "" },
  { type: "oAuth2", label: "OAuth 2.0", component: <OAuth2Form /> }
];
const NameInput = withValueChangeDetection(
  props => <EditableText {...props} />,
  R.identity
);
const typeFromLabel = label =>
  R.find(R.propEq("label", label))(authOptions).type;

class AuthView extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    console.log("AuthView.render", this.props);
    const { type, setType, name, setName } = this.props;
    const selectedAuth = R.find(R.propEq("type", type || "none"))(authOptions);
    return (
      <Card>
        <NameWrapper>
          <NameInput value={name} onChange={setName} />
        </NameWrapper>

        <FormGroup label="Type" labelFor="authTypeSelect">
          <HTMLSelect
            fill={true}
            onChange={setType}
            id="authTypeSelect"
            options={R.map(R.prop("label"), authOptions)}
            value={selectedAuth.label}
            className={Classes.FIXED}
          />
        </FormGroup>
        <Wrapper>{selectedAuth.component}</Wrapper>
      </Card>
    );
  }
  selectContentType(contentType) {
    this.setState({ contentType });
  }
}

// @ts-ignore
export default connect({
  container: authContainer,
  selector: ({ container }) => ({
    type: container.getProp("type"),
    name: container.getProp("name"),
    setType: R.compose(
      R.partial(R.bind(container.setProp, container), ["type"]),
      typeFromLabel,
      R.prop("value"),
      R.prop("currentTarget")
    ),
    setName: R.partial(R.bind(container.setProp, container), ["name"])
  })
})(AuthView);
