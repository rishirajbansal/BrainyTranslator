/*
 * Licensed To: ThoughtExecution
 * Authored By: Rishi Raj Bansal
 * Developed in: November 2019
 *
*/

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import '../../../static/styles/custom.css';

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

//Import Polyfill for custom regenerator runtime and core-js - needed for async and await
import "@babel/polyfill";


ReactDOM.render(<App />, document.getElementById('root'));