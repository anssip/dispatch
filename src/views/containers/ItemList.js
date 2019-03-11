import React, { useRef } from "react";
import styled from "styled-components";
import { Card, EditableText } from "@blueprintjs/core";
import RequestComp from "../components/RequestComp";
const R = require('ramda');


const addItem = ref => {
  console.log("addItem", ref);
  if (ref.current) {
    ref.current.focus();
  }
};

function ItemList(props) {
  // const ref = useRef(null);
  const nameRef = React.createRef();
  const valueRef = React.createRef();

  const { items, setName, setValue } = props;

  return <div>
    {items.map((item, index) =>
      <RequestComp
        ref={index == items.length-1 ? { nameRef, valueRef } : null }
        component={item}
        {...props}
        setName={R.partial(setName, [index])}
        setValue={R.partial(setValue, [index])}
      />)}

    {/* TODO: Don't use RequestComp for these dummy rows   */}
    <RequestComp 
      component={ { name: "Add parameter name", value: "Add parameter value" } } 
      {...props} 
      setName={val => addItem(nameRef)}
      setValue={val => addItem(valueRef)}
    />
  </div>
};

export default ItemList;