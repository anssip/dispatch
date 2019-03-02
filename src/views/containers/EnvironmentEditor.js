import React from "react";
import styled from "styled-components";
import { Intent, EditableText, Text, ControlGroup, Card } from "@blueprintjs/core";
import connect from 'unstated-connect2';
import contextContainer from '../../models/ContextContainer';
import withValueChangeDetection from "../components/Input";
import { Column, Table, ColumnHeaderCell, EditableCell } from "@blueprintjs/table";

const R = require('ramda');
const NameInput = withValueChangeDetection(props => <EditableText {...props} />, R.identity);

const Wrapper = styled.div`
`;

const NameWrapper = styled.span`
  margin: 10px;
  text-align: left;
  font-size: 14px;
`;


class EnvironmentEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  // https://github.com/palantir/blueprint/blob/develop/packages/docs-app/src/examples/table-examples/tableEditableExample.tsx
  render() {
    console.log("EnvironmentEditor", this.props);
    const { container, environment, environment: { name, variables = [] }, setName } = this.props;

    const cellRenderer = R.partial(R.bind(this.renderCell, this), [container, variables]);

    return (
      <Wrapper>
        <Card style={{ border: 0, boxShadow: 'none', marginTop: 0 }}>
          <Text tagName="span">Env: </Text> 
          <NameWrapper>
            <NameInput onChange={setName} value={name} />
          </NameWrapper>
        </Card>
        <Table numRows={variables.length} columnWidths={[ 110, 180 ]}>
          <Column cellRenderer={(cellRenderer)} columnHeaderCellRenderer={this.renderColumnHeader} />
          <Column cellRenderer={cellRenderer} columnHeaderCellRenderer={this.renderColumnHeader} />
          {/* <Column cellRenderer={(row, col) => this.renderCell(container, variables, row, col)} columnHeaderCellRenderer={ this.renderColumnHeader }/>
          <Column cellRenderer={(row, col) => this.renderCell(container, variables, row, col)} columnHeaderCellRenderer={ this.renderColumnHeader }/> */}
        </Table>
      </Wrapper>);
  }

  renderColumnHeader = index => {
    return <ColumnHeaderCell name={['Name', 'Value'][index]} />;
  }

  renderCell(container, variables, row, col) {
    const { name, value } = variables[row];
    const cellValue = col == 0 ? name : value;

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
    environment: container.getSelectedEnv(),
    setName: R.bind(container.setEnvironmentName, container)
  })

})(EnvironmentEditor);
