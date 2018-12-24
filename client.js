import React from 'react';
import {BrowserRouter, HashRouter} from 'react-router-dom';
import {hydrate} from 'react-dom';
import App from './app';

console.log('hello world');

const Router = module.hot ? HashRouter : BrowserRouter;


hydrate(
  <Router basename={window.rootUrl||'/'}>
    <App />
  </Router>,
  document.getElementById('react-root')
)
