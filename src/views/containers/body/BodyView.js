import React from "react";
import { FormGroup, Text, Classes, Card, ControlGroup, HTMLSelect, InputGroup, Button, Tabs, Tab } from "@blueprintjs/core";
import styled from "styled-components";
import { template } from "handlebars";
import BodyEditor from "./BodyEditor";


const BodyWrapper = styled.div`
  padding-top: 10px;
`;

const Divider = styled.div`
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
        <Divider>
          <BodyWrapper>
            <BodyEditor paneWidth={this.props.paneWidth} paneHeight={this.props.paneHeight} contentType={this.state.contentType} />
          </BodyWrapper>
        </Divider>
      </div>);
  }
  selectContentType(contentType) {
    this.setState({ contentType });
  }
}

export default BodyView;