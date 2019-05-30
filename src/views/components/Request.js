import React, { useState } from "react";
import styled from "styled-components";
import { Text, ContextMenu, Menu, MenuItem, Spinner } from "@blueprintjs/core";
const R = require("ramda");
const { clipboard, remote } = window.require("electron");

// blueprint Indogo5
const Method = styled.span`
  color: #5642a6;
  margin-right: 5px;
`;
const DispatchSpinner = styled.div`
  margin-top: -19px;
  padding: 0;
  float: right;
`;
const exportRequest = (request, getPreview) => {
  remote
    .getCurrentWindow()
    .webContents.send(
      "export-request",
      `${request.name.replace(/ /g, "-")}.sh`,
      getPreview()
    );
};
const copyToClipboard = getData => clipboard.writeText(getData());

const showContextMenu = (
  setIsContextMenuOpen,
  request,
  duplicate,
  deleteRequest,
  getPreview,
  e
) => {
  e.preventDefault();
  ContextMenu.show(
    <Menu>
      <MenuItem icon="duplicate" text="Duplicate" onClick={duplicate} />
      <MenuItem
        icon="share"
        text="Copy as CURL command"
        onClick={R.partial(copyToClipboard, [getPreview])}
      />
      <MenuItem
        icon="export"
        text="Export as CURL command"
        onClick={R.partial(exportRequest, [request, getPreview])}
      />
      <MenuItem icon="delete" text="Delete" onClick={deleteRequest} />
    </Menu>,
    { left: e.clientX, top: e.clientY },
    () => setIsContextMenuOpen(false),
    true // isDarkTheme?
  );
  // indicate that context menu is open so we can add a CSS class to this element
  setIsContextMenuOpen(true);
};

const Request = props => {
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(0);
  const {
    model,
    handleClick,
    duplicateRequest,
    deleteRequest,
    getPreview
  } = props;
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
      onContextMenu={R.partial(showContextMenu, [
        setIsContextMenuOpen,
        model,
        duplicateRequest,
        deleteRequest,
        getPreview
      ])}
      style={
        model.selected
          ? { color: "#fff", backgroundColor: "#B3CFFF" }
          : { color: "#0" }
      }
      onClick={handleClick}
    >
      <Text ellipsize={true}>
        <Method>{model.method}</Method>
        {model.name}
      </Text>
      {model.isDispatching ? (
        <DispatchSpinner>
          <Spinner size={Spinner.SIZE_SMALL} />
        </DispatchSpinner>
      ) : (
        ""
      )}
    </RequestCard>
  );
};

export default Request;
