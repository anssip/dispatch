import React from "react";
import styled from "styled-components";
import { InputGroup } from "@blueprintjs/core";
import connect from 'unstated-connect2';
import requestContainer from '../../models/RequestContainer';
import Request from '../components/Request';

const R = require('ramda');

const RequestWrapper = styled.div`
  cursor: pointer;
`;

const RequestList = ({ requests, select }) =>
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
    { renderRequests(requests, select) } </div>

const renderRequests = (requests, select) =>
  requests.map((r, i) =>
    <RequestWrapper>
      <Request handleClick={R.partial(select, [i])} id={i} model={r} />
    </RequestWrapper>
  );

// @ts-ignore
export default connect({
  container: requestContainer,
   selector: ({ container }) => ({ 
     requests: container.getRequests(),
     select: R.bind(container.select, container)
  })

})(RequestList);
