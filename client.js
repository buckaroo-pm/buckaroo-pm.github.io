import "./styles/main.css"
import React from 'react';
import {BrowserRouter as Router, HashRouter} from 'react-router-dom';
import {hydrate} from 'react-dom';
import App from './app';

console.log('hello world');

hydrate(
  <Router basename={window.rootUrl||'/'}>
    <App />
  </Router>,
  document.getElementById('react-root')
)
