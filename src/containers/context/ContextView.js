import React from "react";
import { FormGroup, Text, Classes, Card, ControlGroup, HTMLSelect, InputGroup, Button, Tabs, Tab } from "@blueprintjs/core"; 
import styled from "styled-components";
import connect from 'unstated-connect2';
import container from "../../models/ContextContainer";

const R = require("ramda");

const Wrapper = styled.div`
`;

const ContextView = ({ addContext }) =>
  <Wrapper>

  </Wrapper>;

// @ts-ignore
export default connect({
  container,
  selector: ({ container }) => ({ 
    addContext: R.bind(container.addContext, container)
  })
})(ContextView);
