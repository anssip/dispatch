import React from "react";
import styled from "styled-components";
import { Intent } from "@blueprintjs/core";
import connect from 'unstated-connect2';
import contextContainer from '../../models/ContextContainer';

import { Column, Table, ColumnHeaderCell, EditableCell } from "@blueprintjs/table";
import { variables } from "electron-log";

const R = require('ramda');

class EnvironmentEditor extends React.Component {
  constructor(props) {
    super(props);
  }
  
  // https://github.com/palantir/blueprint/blob/develop/packages/docs-app/src/examples/table-examples/tableEditableExample.tsx
  render() {
    console.log("EnvironmentEditor", this.props);
    const { container, environment, environment: { variables = [] } } = this.props;
    
    const cellRenderer = R.partial(R.bind(this.renderCell, this), [container, variables]);

    return (
    <Table numRows={variables.length}>
      <Column cellRenderer={cellRenderer} columnHeaderCellRenderer={ this.renderColumnHeader }/>
      <Column cellRenderer={cellRenderer} columnHeaderCellRenderer={ this.renderColumnHeader }/>
      {/* <Column cellRenderer={(row, col) => this.renderCell(container, variables, row, col)} columnHeaderCellRenderer={ this.renderColumnHeader }/>
      <Column cellRenderer={(row, col) => this.renderCell(container, variables, row, col)} columnHeaderCellRenderer={ this.renderColumnHeader }/> */}
    </Table>);
  }

  renderColumnHeader = index => {
    return <ColumnHeaderCell name={['Name', 'Value'][index]}  />;
  }

  renderCell(container, variables, row, col) {
    const {name, value} = variables[row];
    const cellValue = col == 0 ? name : value;
    return (
      <EditableCell
          value={cellValue == null ? "" : cellValue}
          onCancel={this.cellValidator(container, row, col)}
          onChange={this.cellValidator(container, row, col)}
          // onConfirm={this.cellSetter(container, rowIndex, columnIndex)}
      />
    )
  }

  isValidValue(value) {
    // TODO: fix this
    return value.indexOf('_') < 0;
  }

  cellValidator(container, rowIndex, columnIndex) {
    return value => {
        const intent = this.isValidValue(value) ? null : Intent.DANGER;
        // @ts-ignore
        this.setState( { [`intent_${rowIndex}_${columnIndex}`]: intent } );

        const varProp = columnIndex == 0 ? "name" : "value";
        container.setVariable(rowIndex, { [varProp]: value });
    };
  } 
}

export default connect({
  container: contextContainer,
   selector: ({ container }) => ({ 
     container,
     environment: container.getSelectedEnv()
  })

})(EnvironmentEditor);
