import React from 'react';
// import styled from 'styled-components';
import SplitPane from 'react-split-pane';
import Request from '../components/Request';
import './splitpane.css';
const R = require('ramda');

const MainWindow = props => 
    <SplitPane split="vertical" minSize={100} defaultSize={200}>
        <div>
            {renderRequests(props.requests)}
        </div>

        <div>{ props.name }</div>
    </SplitPane>;

const renderRequests = R.map(r => <Request model={r} />);


export default MainWindow;