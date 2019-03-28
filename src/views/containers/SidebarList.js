import React from "react";
import styled from "styled-components";
import { InputGroup } from "@blueprintjs/core";
import { SortableContainer, SortableElement } from "react-sortable-hoc";

const R = require("ramda");
const Wrapper = styled.div`
  cursor: pointer;
  margin-left: -40px;
  margin-right: 10px;
`;
const SortableItem = SortableElement(({ value }) => <Wrapper>{value}</Wrapper>);
const SortableList = SortableContainer(({ render, items }) => {
  return (
    <ul>
      {items.map((value, index) => (
        <SortableItem
          key={`item-${index}`}
          index={index}
          value={render(value, index)}
        />
      ))}
    </ul>
  );
});
const SidebarList = ({ items, render, onSortEnd }) => (
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
    <SortableList
      render={render}
      items={items}
      onSortEnd={onSortEnd}
      distance={10}
    />
  </div>
);

export default SidebarList;
