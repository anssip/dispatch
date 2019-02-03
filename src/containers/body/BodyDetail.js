import React from "react";
import { Divider, FormGroup, Text, Classes, Card, ControlGroup, HTMLSelect, InputGroup, Button, Tabs, Tab } from "@blueprintjs/core";
import styled from "styled-components";
import { template } from "handlebars";
import Body from "./Body";
import TemplatedBody from "./TemplatedBody";


const BodyContainer = styled.div`
  padding-top: 10px;
`;

const BodyDivider = styled.div`
  margin-top: 20px;
`;

class RequestDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = { template: '--' };
  }
  render() {
    return (
    <div>
      <FormGroup
        label="Template"
        labelFor="templateSelect"
        inline={true}
      >
        <HTMLSelect onChange={e => this.selectTemplate(e.currentTarget.value)} id="templateSelect" options={['--', 'source', 'sink']} className={Classes.FIXED} />
      </FormGroup>
      <BodyDivider>
        <BodyContainer>
          {this.isTemplated() ? <TemplatedBody /> : <Body />}
        </BodyContainer>
      </BodyDivider>
    </div>);
  }
  selectTemplate(template) {
    console.log(template);
    this.setState({ template });
  }
  isTemplated() {
    console.log("is templated?");
    return this.state.template !== "--";
  }
}

export default RequestDetail;