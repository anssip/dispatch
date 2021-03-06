import React from "react";
import styled from "styled-components";
import { Intent, Button, ButtonGroup, Drawer } from "@blueprintjs/core";
import connect from "unstated-connect2";
import contextContainer from "../../models/ContextContainer";
import {
  Column,
  Table,
  ColumnHeaderCell,
  EditableCell,
  EditableName
} from "@blueprintjs/table";

const R = require("ramda");
const Wrapper = styled.div``;

class EnvironmentEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isExpanded: false, columnWidths: new Map() };
  }
  render() {
    console.log("EnvironmentEditor", this.props);
    const {
      container,
      environments,
      variables,
      addEnvironment,
      addVariable,
      selectVariable,
      deleteVariable
    } = this.props;

    const getColumnWidths = () => {
      const widths = [
        120,
        ...environments.map(e =>
          this.state.columnWidths.has(e) ? this.state.columnWidths.get(e) : 100
        )
      ];
      // console.log("widths", widths);
      return widths;
    };
    const onColumnWidthChanged = (index, size) => {
      const env = environments[index - 1];
      // console.log(`column width for env '${env}' changed to ${size}`);
      this.state.columnWidths.set(env, size);
    };
    const renderCell = (env, row, col) => {
      const value = container.getVariableAt(env, row);
      return (
        <EditableCell
          intent={this.isValidValue(value) ? null : Intent.DANGER}
          value={value == null ? "" : value}
          onCancel={cellValidator(env, row)}
          onChange={cellValidator(env, row)}
        />
      );
    };
    const cellValidator = (env, rowIndex) => {
      return value => container.setVariableAt(env, rowIndex, { value });
    };
    const renderVariableColumnHeader = col => (
      <ColumnHeaderCell name="Variable name" />
    );

    const renderVariableNameCell = (row, col) => {
      const value = variables[row].name;
      return (
        <EditableCell
          value={typeof value == "string" ? value : ""}
          onCancel={variableNameValidator(row, col)}
          onChange={variableNameValidator(row, col)}
        />
      );
    };
    const variableNameValidator = (row, col) => {
      return value => container.setVariableNameAt(row, value);
    };

    const nameEditor = (name, index) => {
      console.log(
        `nameEditor() index == ${index}, name == ${JSON.stringify(name)}`
      );
      return (
        <EditableName
          index={index}
          name={typeof name == "string" ? name : ""}
          onCancel={envNameValidator}
          onChange={envNameValidator}
        />
      );
    };

    const envNameValidator = (name, index) => {
      console.log(`envNameValidator() index == ${index}, name == ${name}`);
      container.setEnvironmentName(environments[index - 1], name);
    };

    const renderEnvColumnHeader = (env, index) => {
      return <ColumnHeaderCell name={env} nameRenderer={nameEditor} />;
    };

    const onSelection = regions => {
      if (regions.length == 0 || !regions[0].rows) return;
      selectVariable(regions[0].rows[0]);
    };

    const renderVariables = () => (
      <Wrapper>
        <Table
          numRows={variables.length}
          columnWidths={getColumnWidths()}
          onSelection={onSelection}
          onColumnWidthChanged={onColumnWidthChanged}
        >
          <Column
            key="vars"
            cellRenderer={renderVariableNameCell}
            columnHeaderCellRenderer={renderVariableColumnHeader}
          />
          {environments.map((e, i) => (
            <Column
              key={i + 1}
              cellRenderer={R.partial(renderCell, [e])}
              columnHeaderCellRenderer={R.partial(renderEnvColumnHeader, [e])}
            />
          ))}
        </Table>
        <ButtonGroup style={{ marginTop: 20 }}>
          <Button icon="add" onClick={addVariable} />
          <Button icon="delete" onClick={deleteVariable} />
        </ButtonGroup>
      </Wrapper>
    );

    return (
      <Wrapper>
        <ButtonGroup
          className="bp3-vertical"
          style={{ zIndex: 10, position: "absolute", top: 70, right: 5 }}
          minimal={false}
          fill={false}
        >
          <Button
            icon="fullscreen"
            small={true}
            onClick={R.bind(this.expand, this)}
          />
          <Button icon="add" onClick={addEnvironment} />
        </ButtonGroup>

        {renderVariables()}

        <Drawer
          className=""
          transitionName=""
          usePortal={true}
          transitionDuration={0}
          size={Drawer.SIZE_LARGE}
          icon="info-sign"
          onClose={R.bind(this.collapse, this)}
          title="Environment Variables"
          {...this.state}
        >
          <Button
            icon="add"
            onClick={addEnvironment}
            style={{ zIndex: 10, position: "absolute", top: 45, right: 5 }}
          />
          {renderVariables()}
        </Drawer>
      </Wrapper>
    );
  }
  isValidValue(value) {
    return true;
  }
  expand() {
    this.setState({ isOpen: true });
  }
  collapse() {
    this.setState({ isOpen: false });
  }
}

export default connect({
  container: contextContainer,
  selector: ({ container }) => ({
    container,
    environments: container.getEnvs(),
    variables: container.getVariables(),
    addEnvironment: R.bind(container.addNewEnvironment, container),
    addVariable: R.bind(container.addEmptyVariable, container),
    deleteVariable: R.bind(container.deleteSelectedVariable, container),
    selectVariable: R.bind(container.selectVariable, container)
  })
})(EnvironmentEditor);
