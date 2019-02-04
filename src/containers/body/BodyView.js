import React from "react";
import { Divider, FormGroup, Text, Classes, Card, ControlGroup, HTMLSelect, InputGroup, Button, Tabs, Tab } from "@blueprintjs/core";
import styled from "styled-components";
import { template } from "handlebars";
import BodyViewComponent from "./BodyViewComponent";
import TemplatedBodyViewComponent from "./TemplatedBodyViewComponent";


const BodyContainer = styled.div`
  padding-top: 10px;
`;

const BodyDivider = styled.div`
  margin-top: 20px;
`;

class BodyView extends React.Component {

  constructor(props) {
    super(props);
    this.state = { template: '--', contentType: 'application/json' };
  }
  render() {
    return (
      <div>
        <FormGroup
          label="Template & type"
          labelFor="templateSelect"
          inline={true}
        >
          <HTMLSelect 
            onChange={e => this.selectTemplate(e.currentTarget.value)} 
            id="templateSelect" 
            options={['--', 'source', 'sink']} 
            value={this.state.template}
            className={Classes.FIXED} />
          <HTMLSelect 
            onChange={e => this.selectContentType(e.currentTarget.value)} 
            id="contentTypeSelect" 
            options={['JSON', 'Other', 'No body']} 
            value={this.state.contentType}
            className={Classes.FIXED} 
            disabled={this.isTemplated()}/>
        </FormGroup>
        <BodyDivider>
          <BodyContainer>
            {this.isTemplated() ? <TemplatedBodyViewComponent /> : <BodyViewComponent paneWidth={this.props.paneWidth} contentType={this.state.contentType} />}
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
  selectContentType(contentType) {
    this.setState({ contentType });
  }
}

export default BodyView;