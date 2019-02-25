import React from "react";
import styled from "styled-components";
import { InputGroup } from "@blueprintjs/core";
import connect from 'unstated-connect2';
import contextContainer from '../../models/ContextContainer';

import { Column, Table, ColumnHeaderCell } from "@blueprintjs/table";

const R = require('ramda');

class EnvironmentEditor extends React.Component {
  constructor(props) {
    super(props);
  }
  
  // https://github.com/palantir/blueprint/blob/develop/packages/docs-app/src/examples/table-examples/tableEditableExample.tsx
  render() {
    const { environment, environment: { variables = [] } } = this.props;

    return (
    <Table numRows={variables.length + 1}>
      <Column columnHeaderCellRenderer={ this.renderColumnHeader }/>
      <Column columnHeaderCellRenderer={ this.renderColumnHeader }/>
    </Table>);
  }

  renderColumnHeader = index => {
    return <ColumnHeaderCell name={['Name', 'Value'][index]}  />;
  };

  renderColumnCell = (row, col) => {
    /*
       const dataKey = TableEditableExample.dataKey(rowIndex, columnIndex);
        const value = this.state.sparseCellData[dataKey];
        return (
            <EditableCell
                value={value == null ? "" : value}
                intent={this.state.sparseCellIntent[dataKey]}
                onCancel={this.cellValidator(rowIndex, columnIndex)}
                onChange={this.cellValidator(rowIndex, columnIndex)}
                onConfirm={this.cellSetter(rowIndex, columnIndex)}
            />
        );
    */
  };

}

export default connect({
  container: contextContainer,
   selector: ({ container }) => ({ 
     environment: container.getSelectedEnv()
  })

})(EnvironmentEditor);
