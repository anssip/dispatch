import React, { useRef } from "react";
import styled from "styled-components";
import {
  Card,
  EditableText,
  ControlGroup,
  Classes,
  Button
} from "@blueprintjs/core";
import RequestComp from "../components/RequestComp";
import withValueChangeDetection from "../components/Input";

const R = require("ramda");

class ItemList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.nameRef = React.createRef();
    this.valueRef = React.createRef();
    this.state = { currentRef: null };
  }

  addItem = (index, currentRef, set, event) => {
    set(index, event.target.value);
    this.setState({ currentRef });
  };
  componentDidUpdate() {
    if (this.state.currentRef && this.state.currentRef.current) {
      this.state.currentRef.current.focus();
    }
  }
  setName(index, value) {
    this.setState({ currentRef: null, input: null }, () =>
      this.props.setName(index, value)
    );
  }
  setValue(index, value) {
    this.setState({ currentRef: null, input: null }, () =>
      this.props.setValue(index, value)
    );
  }
  resetValue(placeholderLabel, event) {
    const val = event.target.value;
    if (val === "") {
      event.target.value = placeholderLabel;
    }
  }
  render() {
    const { items, setName, setValue, del, add } = this.props;
    const placeholderProps = [
      { label: "Add parameter name", setter: setName, ref: this.nameRef },
      { label: "Add parameter value", setter: setValue, ref: this.valueRef }
    ];
    return (
      <div>
        {items.map((item, index) => (
          <RequestComp
            key={index}
            ref={
              index == items.length - 1
                ? { nameRef: this.nameRef, valueRef: this.valueRef }
                : null
            }
            component={item}
            {...this.props}
            setName={value => this.setName(index, value)}
            setValue={value => this.setValue(index, value)}
            del={R.partial(del, [index])}
          />
        ))}
        <ControlGroup fill={true}>
          {placeholderProps.map(p => (
            <input
              className="bp3-input"
              style={{ cursor: "pointer", color: "#999", fontStyle: "italic" }}
              value={p.label}
              onBlur={R.partial(this.resetValue, [p.label])}
              onFocus={e => (e.target.value = "")}
              onChange={R.partial(this.addItem, [
                items.length,
                p.ref,
                p.setter
              ])}
            />
          ))}
          <Button
            icon="add"
            style={{ backgroundColor: "#293742" }}
            className={Classes.FIXED}
            onClick={add}
          />
          {/* onClick={R.partial(this.addItem, [items.length, null, setName, {target: { value: "" }}])}/> */}
        </ControlGroup>
      </div>
    );
  }
}

export default ItemList;
