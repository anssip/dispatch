import React from "react";
import styled from "styled-components";
import { InputGroup } from "@blueprintjs/core";
import connect from 'unstated-connect2';
import contextContainer from '../../models/ContextContainer';

const R = require('ramda');

class EnvironmentEditor extends React.Component {

}

export default connect({
  container: contextContainer,
   selector: ({ container }) => ({ 
     environment: container.getSelectedEnv(),
     select: R.bind(container.select, container)
  })

})(EnvironmentEditor);
