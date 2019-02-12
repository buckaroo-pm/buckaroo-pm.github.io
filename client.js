import React from 'react';
import { BrowserRouter as Router, HashRouter } from 'react-router-dom';
import { hydrate } from 'react-dom';
import App from './app';
import './styles/main.css';

const onChange = () => {
  if (typeof window !== undefined && window.ga) {
    ga('send', 'pageview');
  }
}

hydrate(
  <Router basename={window.rootUrl || '/'} onChange={onChange} >
    <App />
  </Router>,
  document.getElementById('react-root')
);
