import React, { useRef } from "react";
import styled from "styled-components";
import { Card, EditableText } from "@blueprintjs/core";
import RequestComp from "../components/RequestComp";
const R = require('ramda');


const addItem = items => {

};

function ItemList(props) {
  const inputEl = useRef(null);

  return <div>
    {props.items.map((item, index) =>
      <RequestComp
        component={item}
        {...props}
        setName={R.partial(props.setName, [index])}
        setValue={R.partial(props.setValue, [index])}
      />)}

    <RequestComp component={ { name: "Add parameter name", value: "Add parameter value" } } {...props} setName={props.add} setValue={props.add} />
  </div>
};

export default ItemList;