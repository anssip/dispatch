import React from "react"
import {
  FormGroup,
  Text,
  Classes,
  Card,
  ControlGroup,
  HTMLSelect,
  InputGroup,
  Button,
  Tabs,
  Tab
} from "@blueprintjs/core"
import styled from "styled-components"
import BodyEditor from "./BodyEditor"

const BodyWrapper = styled.div``

const Divider = styled.div``

const BodyView = props => (
  <>
    <FormGroup label="Type" labelFor="contentTypeSelect" inline={true}>
      <HTMLSelect
        onChange={props.onChange}
        id="contentTypeSelect"
        options={[
          { label: "JSON", value: "application/json" },
          { label: "Text", value: "text/plain" }
        ]}
        value={props.contentType}
        className={Classes.FIXED}
      />
    </FormGroup>
    <Divider>
      <BodyWrapper>
        <BodyEditor
          paneWidth={props.paneWidth}
          paneHeight={props.paneHeight}
          contentType={props.contentType}
        />
      </BodyWrapper>
    </Divider>
  </>
)

export default BodyView
