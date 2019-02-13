import React from "react";
import { FormGroup, Text, Classes, Card, ControlGroup, HTMLSelect, InputGroup, Button, Tabs, Tab } from "@blueprintjs/core"; 
import styled from "styled-components";
import connect from 'unstated-connect2';
import container from "../../models/ContextContainer";

const R = require("ramda");

const Wrapper = styled.div`
`;

const ContextView = ({ ctx }) =>
  <Wrapper>
    {JSON.stringify(ctx)}
  </Wrapper>;

// @ts-ignore
export default connect({
  container,
  selector: ({ container }) => ({ 
    ctx: container.getContext()
    // addContext: R.bind(container.addContext, container)
  })
})(ContextView);
