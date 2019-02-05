import React from "react";
import { Divider, FormGroup, Text, Classes, Card, ControlGroup, HTMLSelect, InputGroup, Button, Tabs, Tab } from "@blueprintjs/core";
import styled from "styled-components";
import { template } from "handlebars";
import BodyViewComponent from "./BodyViewComponent";


const BodyContainer = styled.div`
  padding-top: 10px;
`;

const BodyDivider = styled.div`
  margin-top: 20px;
`;

class BodyView extends React.Component {

  constructor(props) {
    super(props);
    this.state = { contentType: 'application/json' };
  }
  render() {
    return (
      <div>
        <FormGroup
          label="Type"
          labelFor="templateSelect"
          inline={true}
        >
          <HTMLSelect 
            onChange={e => this.selectContentType(e.currentTarget.value)} 
            id="contentTypeSelect" 
            options={['JSON', 'Other', 'No body']} 
            value={this.state.contentType}
            className={Classes.FIXED} 
            />
        </FormGroup>
        <BodyDivider>
          <BodyContainer>
            <BodyViewComponent paneWidth={this.props.paneWidth} contentType={this.state.contentType} />
          </BodyContainer>
        </BodyDivider>
      </div>);
  }
  selectContentType(contentType) {
    this.setState({ contentType });
  }
}

export default BodyView;