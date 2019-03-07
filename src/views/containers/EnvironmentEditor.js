import React from "react";
import styled from "styled-components";
import { IconName, Intent, EditableText, Text, ControlGroup, Card, Button, ButtonGroup } from "@blueprintjs/core";
import connect from 'unstated-connect2';
import contextContainer from '../../models/ContextContainer';
import withValueChangeDetection from "../components/Input";
import { Column, Table, ColumnHeaderCell, EditableCell, EditableName } from "@blueprintjs/table";

const R = require('ramda');
const Wrapper = styled.div`
`;

class EnvironmentEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log("EnvironmentEditor", this.props);
    const { container, environments, variables, addEnvironment } = this.props;

    const renderCell = (env, row, col) => {
      const value = container.getVariableAt(env, row);
      return (
        <EditableCell
          intent={this.isValidValue(value) ? null : Intent.DANGER}
          value={value == null ? "" : value}
          onCancel={cellValidator(env, row)}
          onChange={cellValidator(env, row)}
        />
      )
    };
    const cellValidator = (env, rowIndex) => {
      return value => container.setVariableAt(env, rowIndex, {value});
    };
    const renderVariableColumnHeader = col => <ColumnHeaderCell name="Name" />;

    const renderVariableNameCell = (row, col) => {
      const value = variables[row].name;
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

    const nameEditor = (name, index) => {
      console.log(`nameEditor() index == ${index}, name == ${JSON.stringify(name)}`);
      return (
      <EditableName 
        index={index} 
        name={typeof name == "string" ? name : ''}
        onCancel={envNameValidator}
        onChange={envNameValidator}
      />);
    };

    const envNameValidator = (name, index) => {
      console.log(`envNameValidator() index == ${index}, name == ${name}`);
      container.setEnvironmentName(environments[index-1], name);
    };

    const renderEnvColumnHeader = (env, index) => {
      return <ColumnHeaderCell name={env} nameRenderer={nameEditor} />;
    };
  
    // console.log(`col widths ${JSON.stringify([ 100, ...environments.map(e => 10 * e.length, 20) ])}`);
    // TODO: enable enableColumnReorderin={true}
    return (
      <Wrapper>
        <ButtonGroup className="bp3-vertical" style={{ zIndex: 10, position: "absolute", top: 70, right: 5, backgroundColor: "#000" }} minimal={false} fill={false}>
          <Button icon="fullscreen" small={true} onClick={R.bind(this.expand, this)} />
          <Button icon="add" onClick={addEnvironment} />
        </ButtonGroup>

        <Table numRows={variables.length} columnWidths={[ 100, ...environments.map(e => 100) ]} >
          <Column key='vars' cellRenderer={renderVariableNameCell} columnHeaderCellRenderer={renderVariableColumnHeader} />
          {environments.map((e, i) => <Column key={i+1} cellRenderer={R.partial(renderCell, [e])} columnHeaderCellRenderer={R.partial(renderEnvColumnHeader, [e])} />)}
        </Table>
      </Wrapper>);
  }

  isValidValue(value) {
    return true;
  }

  expand() {
  }

  addEnvironment() {

  }

}

export default connect({
  container: contextContainer,
  selector: ({ container }) => ({
    container,
    environments: container.getEnvs(),
    variables: container.getVariables(),
    addEnvironment: R.bind(container.addNewEnvironment, container)
  })

})(EnvironmentEditor);
