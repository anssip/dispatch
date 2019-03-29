import React, { useState } from "react";
import styled from "styled-components";
import {
  Card,
  Text,
  ContextMenu,
  Menu,
  MenuItem,
  MenuDivider
} from "@blueprintjs/core";
const R = require("ramda");

// blueprint Indogo5
const Method = styled.span`
  color: #ad99ff;
  margin-right: 5px;
`;

const showContextMenu = (setIsContextMenuOpen, e) => {
  e.preventDefault();
  ContextMenu.show(
    <Menu>
      <MenuItem icon="duplicate" text="Duplicate" />
      <MenuItem icon="export" text="Copy as CURL command" />
      <MenuItem icon="delete" text="Delete" />
      <MenuDivider />
      <MenuItem disabled={true} text="Settings" />
    </Menu>,
    { left: e.clientX, top: e.clientY },
    () => setIsContextMenuOpen(false)
  );
  // indicate that context menu is open so we can add a CSS class to this element
  setIsContextMenuOpen(true);
};

const Request = props => {
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(0);

  const RequestCard = styled.div`
    padding: 5px 0 5px 0;
    padding-left: 5px;
    cursor: pointer;
    user-select: none;
    border: ${isContextMenuOpen ? "1px solid #48AFF0" : "none"};
    border-bottom: 1px solid
      ${isContextMenuOpen ? "1px solid #48AFF0" : "#5c7080"};
  `;

  return (
    <RequestCard
      onContextMenu={R.partial(showContextMenu, [setIsContextMenuOpen])}
      style={
        props.model.selected
          ? { color: "#fff", backgroundColor: "#394B59" }
          : { color: "#aaa" }
      }
      onClick={props.handleClick}
    >
      <Text ellipsize={true}>
        <Method>{props.model.method}</Method>
        {props.model.name}
      </Text>
    </RequestCard>
  );
};

export default Request;
