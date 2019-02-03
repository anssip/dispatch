import React from "react";
import {  TextArea, Intent, Divider, FormGroup, Text, Classes, Card, ControlGroup, HTMLSelect, InputGroup, Button, Tabs, Tab } from "@blueprintjs/core";
import styled from "styled-components";

class Body extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
  }
  render() {
    return (
      <TextArea
        large={true}
        intent={Intent.PRIMARY}
        onChange={e => this.handleChange(e.target.value)}
        value={this.state.value}
        fill={true}
      />
    );
  }
  handleChange(value) {
    this.setState({ value });
  }
  handleResize(entries) {
    console.log(entries.map(e => `${e.contentRect.width} x ${e.contentRect.height}`));
  }
}

export default Body;
