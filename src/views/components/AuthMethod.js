import React, { useState } from "react";
import styled from "styled-components";
import { Text, ContextMenu, Menu, MenuItem } from "@blueprintjs/core";
const R = require("ramda");

// blueprint Indogo5
const Type = styled.span`
  color: #ad99ff;
  margin-right: 5px;
`;
const showContextMenu = (setIsContextMenuOpen, duplicate, deleteMethod, e) => {
  e.preventDefault();
  ContextMenu.show(
    <Menu>
      <MenuItem icon="duplicate" text="Duplicate" onClick={duplicate} />
      <MenuItem icon="delete" text="Delete" onClick={deleteMethod} />
    </Menu>,
    { left: e.clientX, top: e.clientY },
    () => setIsContextMenuOpen(false),
    true // isDarkTheme?
  );
  // indicate that context menu is open so we can add a CSS class to this element
  setIsContextMenuOpen(true);
};

const AuthMethod = props => {
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(0);
  const { model, handleClick, duplicateMethod, deleteMethod } = props;
  const Wrapper = styled.div`
    padding: 5px 0 5px 0;
    padding-left: 5px;
    cursor: pointer;
    user-select: none;
    border: ${isContextMenuOpen ? "1px solid #48AFF0" : "none"};
    border-bottom: 1px solid
      ${isContextMenuOpen ? "1px solid #48AFF0" : "#5c7080"};
  `;
  return (
    <Wrapper
      onContextMenu={R.partial(showContextMenu, [
        setIsContextMenuOpen,
        duplicateMethod,
        deleteMethod
      ])}
      style={
        props.model.selected
          ? { color: "#fff", backgroundColor: "#394B59" }
          : { color: "#aaa" }
      }
      onClick={handleClick}
    >
      <Text ellipsize={true}>
        <Type>{model.type}</Type>
        {model.name}
      </Text>
    </Wrapper>
  );
};

export default AuthMethod;
