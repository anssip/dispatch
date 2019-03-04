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

    const renderCell = (env, row, col) => {
      const value = container.getVariableAt(env, row);
      return (
        <EditableCell
          intent={this.isValidValue(value) ? null : Intent.DANGER}
          value={value == null ? "" : value}
          onCancel={cellValidator(env, row)}
          onChange={cellValidator(env, row)}
        // onConfirm={this.cellSetter(container, rowIndex, columnIndex)}
        />
      )
    };
    const cellValidator = (env, rowIndex) => {
      return value => container.setVariableAt(env, rowIndex, {value});
    };
    const renderVariableColumnHeader = col => <ColumnHeaderCell name="Name" />;

    // TODO: make sure variable name updates work!
    const renderVariableNameCell = (row, col) => {
      const value = variables[row].name;
      // console.error("renderVariableNameCell", value);
      return (
        <EditableCell
          value={value}
          onCancel={variableNameValidator(row, col)}
          onChange={variableNameValidator(row, col)}
        />
      )
    };
    const variableNameValidator = (row, col) => {
      return value => container.setVariableNameAt(row, value);
    };

    // TODO: implement environment name updates
    const renderEnvColumnHeader = (col) => {
      return <ColumnHeaderCell name={environments[col-1]} />;
    }
  
    return (
      <Wrapper>
        <Table numRows={variables.length} >
          <Column key='vars' cellRenderer={renderVariableNameCell} columnHeaderCellRenderer={renderVariableColumnHeader} />
          {environments.map((e, i) => <Column key={i+1} cellRenderer={R.partial(renderCell, [e])} columnHeaderCellRenderer={renderEnvColumnHeader} />)}
          
        </Table>
      </Wrapper>);
  }

  isValidValue(value) {
    return true;
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
