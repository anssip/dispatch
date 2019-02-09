import React from "react";
import styled from "styled-components";
import { InputGroup } from "@blueprintjs/core";
import connect from 'unstated-connect2';
import requestContainer from '../models/RequestContainer';
import Request from '../components/Request';

const R = require('ramda');

const RequestWrapper = styled.div`
  cursor: pointer;
`;

const RequestList = ({ container }) =>
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
    {renderRequests(container)}
  </div>

const renderRequests = container =>
  container.getRequests().map((r, i) =>
    <RequestWrapper>
      <Request handleClick={R.partial(R.bind(container.select, container), [i])} id={i} model={r} />
    </RequestWrapper>
  );

// @ts-ignore
export default connect({
  container: requestContainer
})(RequestList);
