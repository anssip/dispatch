import React from "react";
import styled from "styled-components";

import Request from '../components/Request';
const R = require('ramda');

const RequestPanel = props => renderRequests(props.requests);

const renderRequests = R.map(r => <Request model={r} />);

export default RequestPanel;
