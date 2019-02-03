import React from 'react';
import styled from 'styled-components';
import SplitPane from 'react-split-pane';
import Sidebar from './Sidebar';
import './splitpane.css';
import RequestDetails from './RequestDetails';

const DetailPanel = styled.div`
  position: relative;
  padding: 5px 10px 0 10px;
  margin: 0px 10px 0 10px;
  width: 100%;
`;

const MainWindow = props => 
    <SplitPane className="bp3-dark" split="vertical" minSize={200} defaultSize={270}>
        <Sidebar requests={props.requests} />

        <RequestDetails />
    </SplitPane>;

export default MainWindow;