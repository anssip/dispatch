import React from 'react';
// import styled from 'styled-components';
import SplitPane from 'react-split-pane';
import Sidebar from './Sidebar';
import './splitpane.css';

const MainWindow = props => 
    <SplitPane className="bp3-dark" split="vertical" minSize={200} defaultSize={270}>
        <div>
            <Sidebar requests={props.requests} />
        </div>

        <div>{ props.name }</div>
    </SplitPane>;

export default MainWindow;