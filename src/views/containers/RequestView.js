import React from "react"
import {
  EditableText,
  Classes,
  Card,
  ControlGroup,
  HTMLSelect,
  Menu,
  MenuItem,
  Popover,
  InputGroup,
  Button,
  Tabs,
  Tab,
  Icon,
  Spinner
} from "@blueprintjs/core"
import styled from "styled-components"
import RequestViewComponent from "./RequestViewCompoent"
import ItemList from "./ItemList"
import BodyView from "./body/BodyView"
import AuthView from "./auth/AuthView"
import connect from "unstated-connect2"
import requestContainer from "../../models/RequestContainer"
import contextContainer from "../../models/ContextContainer"
import authContainer from "../../models/AuthContainer"
import withValueChangeDetection from "../components/Input"
import Dispatcher from "../../models/Dispatcher"
import RequestBuilder from "../../models/RequestBuilder"

const R = require("ramda")
const UrlInput = withValueChangeDetection(
  props => <input className="bp3-input" {...props} />,
  R.compose(
    R.prop("value"),
    R.prop("target")
  )
)
const NameInput = withValueChangeDetection(
  props => (
    <h3>
      <EditableText {...props} />
    </h3>
  ),
  R.identity
)
const METHODS = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]

const TabContainer = styled.div`
  margin-top 0px;
`
const MainPane = styled.div`
  height: 100%;
`
const AuthMethodWrapper = styled.div`
  text-align: right;
  padding-top: 20px;
  width: 200px;
  min-width: 150px;
`

class RequestView extends React.Component {
  constructor(props) {
    super(props)
    this.state = { prevReq: {}, name: null }
    this.prevRequest = {}
  }
  render() {
    const {
      request,
      paneWidth,
      paneHeight,
      setName,
      setUrl,
      dispatchSelected,
      addParam,
      setMethod,
      setParamName,
      setParamValue,
      deleteParam,
      addHeader,
      setHeaderName,
      setHeaderValue,
      deleteHeader,
      setAuthMethod,
      addVariable,
      setVariableName,
      setVariableValue,
      deleteVariable,
      authMethods,
      setContentType
    } = this.props

    console.log("RequestView, authMethods", request.authMethod)
    if (request) {
      return (
        <MainPane>
          <Card style={{ margin: 0, paddingBottom: 0, height: "100%" }}>
            <ControlGroup fill={true}>
              <HTMLSelect
                value={request.method}
                onChange={setMethod}
                options={METHODS}
                className={Classes.FIXED}
              />
              <UrlInput
                style={request.isDispatching ? { marginRight: "5px" } : {}}
                value={request.url}
                onChange={setUrl}
              />

              {request.isDispatching ? (
                <Spinner size={Spinner.SIZE_SMALL} className={Classes.FIXED} />
              ) : (
                <Button
                  icon="arrow-right"
                  className={Classes.FIXED}
                  onClick={dispatchSelected}
                />
              )}
            </ControlGroup>

            <ControlGroup fill={true}>
              <NameInput value={request.name} onChange={setName} />
              <AuthMethodWrapper>
                {/* <Icon
                  icon="blocked-person"
                  style={{ marginRight: 8 }}
                  iconSize={16}
                />
                <HTMLSelect
                  value={request.authMethod || 0}
                  onChange={setAuthMethod}
                  options={authMethods}
                  className={Classes.FIXED}
                /> */}
                <Popover
                  content={
                    <Menu>
                      <MenuItem
                        text="no auth"
                        onClick={R.partial(setAuthMethod, [-1])}
                      />
                      {authMethods.map((m, i) => (
                        <MenuItem
                          text={m.name}
                          onClick={R.partial(setAuthMethod, [i])}
                        />
                      ))}
                    </Menu>
                  }
                >
                  <Button
                    icon="eye-open"
                    text={
                      request.authMethod >= 0
                        ? authMethods[request.authMethod].name
                        : "no auth"
                    }
                  />
                </Popover>
              </AuthMethodWrapper>
            </ControlGroup>

            <TabContainer>
              <Tabs
                id="mainTabs"
                onChange={_ => console.log("request tab changed")}
                defaultSelectedTabId="body"
              >
                <Tab
                  id="body"
                  title="Body"
                  panel={
                    <RequestViewComponent
                      render={
                        <BodyView
                          paneWidth={paneWidth}
                          paneHeight={paneHeight}
                          contentType={request.contentType}
                          onChange={setContentType}
                        />
                      }
                    />
                  }
                />
                <Tab
                  id="variables"
                  title="Variables"
                  panel={
                    <RequestViewComponent
                      render={
                        <ItemList
                          items={request.variables || []}
                          add={addVariable}
                          del={deleteVariable}
                          setName={setVariableName}
                          setValue={setVariableValue}
                        />
                      }
                    />
                  }
                />
                <Tab
                  id="query"
                  title="Query"
                  panel={
                    <RequestViewComponent
                      render={
                        // @ts-ignore
                        <ItemList
                          items={request.params || []}
                          add={addParam}
                          del={deleteParam}
                          setName={setParamName}
                          setValue={setParamValue}
                        />
                      }
                    />
                  }
                />
                <Tab
                  id="headers"
                  title="Headers"
                  panel={
                    <RequestViewComponent
                      render={
                        // @ts-ignore
                        <ItemList
                          items={request.headers || []}
                          add={addHeader}
                          del={deleteHeader}
                          setName={setHeaderName}
                          setValue={setHeaderValue}
                        />
                      }
                    />
                  }
                />
              </Tabs>
            </TabContainer>
          </Card>
        </MainPane>
      )
    } else {
      return <div>Select a request</div>
    }
  }
}

// @ts-ignore
export default connect({
  containers: [requestContainer, contextContainer, authContainer],
  selector: ({ containers, paneWidth, paneHeight }) => {
    const setToRequestFromEvent = (f, valueMapper = R.identity) =>
      R.compose(
        R.bind(f, requestContainer),
        valueMapper,
        R.prop("value"),
        R.prop("currentTarget")
      )
    const request = requestContainer.getSelected()
    const auth =
      request.authMethod >= 0
        ? authContainer.getMethods()[request.authMethod]
        : null
    const dispatcher = new Dispatcher(
      new RequestBuilder(
        contextContainer.getValue(),
        contextContainer.getSelectedEnvironment(),
        request,
        auth
      )
    )
    const dispatchSelected = async () => {
      requestContainer.setIsDispatching(true)
      const resp = await dispatcher.dispatch()
      requestContainer.setResponse(resp)
      requestContainer.setIsDispatching(false)
    }

    return {
      paneWidth,
      paneHeight,
      request: requestContainer.getSelected(),
      setName: R.bind(requestContainer.setName, requestContainer),
      setUrl: R.bind(requestContainer.setUrl, requestContainer),
      addParam: R.bind(requestContainer.addParam, requestContainer),
      setParamName: R.bind(requestContainer.setParamName, requestContainer),
      setParamValue: R.bind(requestContainer.setParamValue, requestContainer),
      deleteParam: R.bind(requestContainer.deleteParam, requestContainer),
      addHeader: R.bind(requestContainer.addHeader, requestContainer),
      setHeaderName: R.bind(requestContainer.setHeaderName, requestContainer),
      setHeaderValue: R.bind(requestContainer.setHeaderValue, requestContainer),
      deleteHeader: R.bind(requestContainer.deleteHeader, requestContainer),
      addVariable: R.bind(requestContainer.addVariable, requestContainer),
      setVariableName: R.bind(
        requestContainer.setVariableName,
        requestContainer
      ),
      setVariableValue: R.bind(
        requestContainer.setVariableValue,
        requestContainer
      ),
      deleteVariable: R.bind(requestContainer.deleteVariable, requestContainer),
      dispatchSelected,
      setMethod: setToRequestFromEvent(requestContainer.setMethod),
      setAuthMethod: R.bind(requestContainer.setAuthMethod, requestContainer),
      setContentType: setToRequestFromEvent(requestContainer.setContentType),
      authMethods: authContainer.getMethods()
      // authMethods: R.prepend(
      //   { label: "no auth", value: -1 },
      //   authContainer.getMethods().map((m, i) => ({ label: m.name, value: i }))
      // )
    }
  }
})(RequestView)
