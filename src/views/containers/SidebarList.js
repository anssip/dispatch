import React from "react";
import styled from "styled-components";
import { InputGroup } from "@blueprintjs/core";
import connect from "unstated-connect2";
import requestContainer from "../../models/RequestContainer";

const R = require("ramda");

const Wrapper = styled.div`
  cursor: pointer;
`;

const SidebarList = ({ items, render }) => (
  <div>
    <InputGroup
      className="search"
      disabled={false}
      large={false}
      leftIcon="search"
      onChange={_ => {
        console.log("search input");
      }}
      placeholder="Filter"
      small={true}
      value={""}
    />
    {items.map((item, index) => (
      <Wrapper>{render(item, index)}</Wrapper>
    ))}
  </div>
);

// export default connect({
//   container: requestContainer,
//    selector: ({ container }) => ({
//      requests: container.getRequests(),
//      select: R.bind(container.select, container)
//   })
// })(SidebarList);

export default SidebarList;
