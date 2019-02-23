import React from "react";
const R = require("ramda");

const wellBehavingInput = (InputComponent, mapValue) => {
  return class extends React.Component {
    constructor(props, ...args) {
      super(props, ...args);
      this.state = { value: props.value };
    }
  
    componentWillReceiveProps(nextProps) {
      if (this.state.value !== nextProps.value) {
        this.setState({ value: nextProps.value });
      }
    }
  
    onChange(evt) {
      const value = mapValue(evt);
      console.log(`Input: evt.target.value = ${value}`);
      this.setState({ value: value }, () => this.props.onChange(value));
    }
  
    render() {
     return <InputComponent className="bp3-input" {...this.props} {...this.state} onChange={R.bind(this.onChange, this)} />;
    }
  };
}

export default wellBehavingInput;