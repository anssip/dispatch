import React from "react";
import styled from "styled-components";
import { InputGroup } from "@blueprintjs/core";

import Request from '../components/Request';
const R = require('ramda');

const RequestList = props =>
  <div>
    <InputGroup
      className='search'
      disabled={false}
      large={false}
      leftIcon="search"
      onChange={_ => { console.log('search input') }}
      placeholder="Filter"
      small={true}
      value={''}
    />
    {renderRequests(props.requests)}
</div>

const renderRequests = R.map((r, i) => <Request id={i} model={r} />);

export default RequestList;
