import React from "react";
import styled from "styled-components";
// @ts-ignore
import { Card, Text, Colors, EditableText, ControlGroup, Button, Classes } from "@blueprintjs/core";
import withValueChangeDetection from "../components/Input";

const R = require('ramda');
const Input = withValueChangeDetection(props => <input ref={props.forwardedRef} className="bp3-input" {...props} />, R.compose(R.prop("value"), R.prop("target")));

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;
// @ts-ignore
const RequestComp = React.forwardRef((props, ref) => {
  console.log("RequestComp", ref);
  const { nameRef, valueRef } = ref || {};
  // @ts-ignore
  const { component, setName, setValue, del } = props;
  return <Wrapper >
    <ControlGroup fill={true}>
      <Input forwardedRef={nameRef} value={component.name} onChange={setName} />
      <Input forwardedRef={valueRef} value={component.value} onChange={setValue} />
      <Button icon="delete" minimal={true} style={{backgroundColor: "#293742"}} className={Classes.FIXED} onClick={del}/>

      {/* // TODO: add a delete button */}
    </ControlGroup>
  </Wrapper>
});

export default RequestComp;
