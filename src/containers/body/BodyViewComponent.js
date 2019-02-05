import React from "react";
import {  ResizeSensor, TextArea, Intent, Divider, FormGroup, Text, Classes, Card, ControlGroup, HTMLSelect, InputGroup, Button, Tabs, Tab } from "@blueprintjs/core";
import styled from "styled-components";
import requests from "../../models/mock-requests";

class BodyViewComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: JSON.stringify(requests[0].body, null, "  ") };
  }
  render() {
    const width = `${this.props.paneWidth - 45}px`;
    console.log(`Body: ${width}`);
    return (
      <TextArea
        large={true}
        intent={Intent.PRIMARY}
        onChange={e => this.handleChange(e.target.value)}
        value={this.state.value}
        fill={true}
        style={{ height: "200px", width, maxWidth: width, minWidth: width }}
      />
    );
  }
  handleChange(value) {
    this.setState({ value });
  }
}

export default BodyViewComponent;
