import React from 'react'; 
import { render } from 'react-dom'; 
import { Provider, Subscribe, Container } from 'overstated'; 
import mockRequests from './mock-requests'; import { identity } from 'rxjs';

const R = require('ramda');

class ContextContainer extends Container {
    state = {
        contexts: []
    };
}

export default ContextContainer;