import React from "react";
import styled from "styled-components";
import { Intent, EditableText, Text, ControlGroup, Card } from "@blueprintjs/core";
import connect from 'unstated-connect2';
import contextContainer from '../../models/ContextContainer';
import withValueChangeDetection from "../components/Input";
import { Column, Table, ColumnHeaderCell, EditableCell } from "@blueprintjs/table";

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

    const varNameCellRenderer = R.partial(R.bind(this.renderVariableNameCell, this), [container, variables]);
    const cellRenderer = R.partial(R.bind(this.renderCell, this), [container]);

    return (
      <Wrapper>
        <Table numRows={variables.length} columnWidths={[ 110, 180 ]}>
          <Column cellRenderer={(varNameCellRenderer)} columnHeaderCellRenderer={this.renderColumnHeader} />
          {environments.map(e => <Column cellRenderer={R.partial(cellRenderer, [e])} columnHeaderCellRenderer={this.renderColumnHeader} />)}

          {/* <Column cellRenderer={(cellRenderer)} columnHeaderCellRenderer={this.renderColumnHeader} />
          <Column cellRenderer={cellRenderer} columnHeaderCellRenderer={this.renderColumnHeader} /> */}
        </Table>
      </Wrapper>);
  }

  renderColumnHeader = index => {
    return <ColumnHeaderCell name={['Name', 'Value'][index]} />;
  }

  renderVariableNameCell(container, variables, row, col) {
    const name = variables[row];
    return (
      <EditableCell
        value={name}
        onCancel={this.cellValidator(container, row, col)}
        onChange={this.cellValidator(container, row, col)}
      // onConfirm={this.cellSetter(container, rowIndex, columnIndex)}
      />
    )
  }

  renderCell(container, env, row, col) {
    const cellValue = env.variables.length < row ? null : env.variables[row];

    return (
      <EditableCell
        intent={this.isValidValue(cellValue) ? null : Intent.DANGER}
        value={cellValue == null ? "" : cellValue}
        onCancel={this.cellValidator(container, row, col)}
        onChange={this.cellValidator(container, row, col)}
      // onConfirm={this.cellSetter(container, rowIndex, columnIndex)}
      />
    )
  }

  isValidValue(value) {
    return true;
  }

  cellValidator(container, rowIndex, columnIndex) {
    return value => {
      console.log('cellValidator', value);

      // Calling setState will make the cursor position jump to the end of the text input
      // this.setState({ [`intent_${rowIndex}_${columnIndex}`]: intent });

      const varProp = columnIndex == 0 ? "name" : "value";
      container.setVariable(rowIndex, { [varProp]: value });
    };
  }
}

export default connect({
  container: contextContainer,
  selector: ({ container }) => ({
    container,
    environments: container.getEnvs(),
    variables: container.getAllVariables(),
    setName: R.bind(container.setEnvironmentName, container)
  })

})(EnvironmentEditor);
