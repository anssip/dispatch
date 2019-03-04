import React from "react";
import styled from "styled-components";
import { Intent, EditableText, Text, ControlGroup, Card } from "@blueprintjs/core";
import connect from 'unstated-connect2';
import contextContainer from '../../models/ContextContainer';
import withValueChangeDetection from "../components/Input";
import { Column, Table, ColumnHeaderCell, EditableCell } from "@blueprintjs/table";
import { ColumnHeader } from "@blueprintjs/table/lib/esm/headers/columnHeader";

const R = require('ramda');

const Wrapper = styled.div`
`;


class EnvironmentEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  // https://github.com/palantir/blueprint/blob/develop/packages/docs-app/src/examples/table-examples/tableEditableExample.tsx
  render() {
    console.log("EnvironmentEditor", this.props);
    const { container, environments, variables, setName } = this.props;

    const varNameCellRenderer = R.partial(R.bind(this.renderVariableNameCell, this), [container, environments, variables]);
    const cellRenderer = R.partial(R.bind(this.renderCell, this), [container]);
    const headerRenderer = R.partial(R.bind(this.renderEnvColumnHeader, this), [environments]);

    return (
      <Wrapper>
        <Table numRows={variables.length} >
          {/* <Column key={0} cellRenderer={(varNameCellRenderer)} columnHeaderCellRenderer={R.bind(this.renderVariableColumnHeader, this)} /> */}
          {environments.map((e, i) => <Column key={i+1} cellRenderer={R.partial(cellRenderer, [e])} columnHeaderCellRenderer={headerRenderer} />)}
          
        </Table>
      </Wrapper>);
  }

  renderVariableColumnHeader = col => <ColumnHeaderCell name="Name" />;

  renderEnvColumnHeader = (environments, col) => {
    return <ColumnHeaderCell name={environments[col]} />;
  }

  renderVariableNameCell(container, environments, variables, row, col) {
    const value = variables[row];
    return (
      <EditableCell
        value={value}
        onCancel={this.cellValidator(container, row, col)}
        onChange={this.cellValidator(container, row, col)}
      // onConfirm={this.cellSetter(container, rowIndex, columnIndex)}
      />
    )
  }

  renderCell(container, env, row, col) {
    const value = container.getVariableAt(env, row);
    return (
      <EditableCell
        intent={this.isValidValue(value) ? null : Intent.DANGER}
        value={value == null ? "" : value}
        onCancel={this.cellValidator(container, env, row, col)}
        onChange={this.cellValidator(container, env, row, col)}
      // onConfirm={this.cellSetter(container, rowIndex, columnIndex)}
      />
    )
  }

  isValidValue(value) {
    return true;
  }

  cellValidator(container, env, rowIndex, columnIndex) {
    return value => {
      console.log(`cellValidator env: ${env}, row: ${rowIndex}, value: ${value}`);

      // Calling setState will make the cursor position jump to the end of the text input
      // this.setState({ [`intent_${rowIndex}_${columnIndex}`]: intent });

      const newVars = container.setVariableAt(env, rowIndex, {value});
      console.log(`cellValidator. got new var after setting it: ${JSON.stringify(newVars, null, 2)}`)
    };
  }
}

export default connect({
  container: contextContainer,
  selector: ({ container }) => ({
    container,
    environments: container.getEnvs(),
    variables: container.getVariables(),
    setName: R.bind(container.setEnvironmentName, container)
  })

})(EnvironmentEditor);
