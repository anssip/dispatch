import React from "react";
import { Classes, Card, ControlGroup, HTMLSelect, InputGroup, Button } from "@blueprintjs/core";
import styled from "styled-components";

const METHODS = ["GET", "POST", "PUT", "DELETE", "OPTIONS"];


const RequestDetails = props =>
  <Card>
    <ControlGroup fill={true}>
      <HTMLSelect options={ METHODS } className={Classes.FIXED} />
      <InputGroup placeholder="http://localhost:8080/users" />
      <Button icon="arrow-right" className={Classes.FIXED} />
    </ControlGroup>
  </Card>;

export default RequestDetails;