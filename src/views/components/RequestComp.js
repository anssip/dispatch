import React from "react";
import styled from "styled-components";
import { Card, Text, Colors, EditableText, ControlGroup } from "@blueprintjs/core";
import withValueChangeDetection from "../components/Input";

const R = require('ramda');
// const Input = withValueChangeDetection(props => <EditableText {...props} />, R.identity);
const Input = withValueChangeDetection(props => <input className="bp3-input" {...props} />, R.compose(R.prop("value"), R.prop("target")));

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const RequestComp = props => {
  const { component, setName, setValue } = props;
  return <Wrapper >
    <ControlGroup fill={true}>
      <Input value={component.name} onChange={setName} />
      <Input value={component.value} onChange={setValue} />
    </ControlGroup>
  </Wrapper>
};

export default RequestComp;
