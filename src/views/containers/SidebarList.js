import React from "react";
import styled from "styled-components";
import { InputGroup, NonIdealState, Button } from "@blueprintjs/core";
import { SortableContainer, SortableElement } from "react-sortable-hoc";

const R = require("ramda");
const Wrapper = styled.div`
  cursor: pointer;
  margin-left: -40px;
  margin-right: 10px;
`;
const SortableItem = SortableElement(({ value }) => <Wrapper>{value}</Wrapper>);
const SortableList = SortableContainer(
  ({ label, addClicked, render, items }) => {
    if (items.length === 0)
      return (
        <NonIdealState
          title={`No ${label}`}
          action={
            <Button
              intent="primary"
              icon="add"
              text="Add"
              onClick={addClicked}
            />
          }
        />
      );
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
  }
);
const SidebarList = ({ label, addClicked, items, render, onSortEnd }) => (
  <SortableList
    label={label}
    addClicked={addClicked}
    render={render}
    items={items}
    onSortEnd={onSortEnd}
    distance={10}
  />
);

export default SidebarList;
