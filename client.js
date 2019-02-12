import React from 'react';
import { BrowserRouter as Router, HashRouter } from 'react-router-dom';
import { hydrate } from 'react-dom';
import App from './app';
import './styles/main.css';

const onUpdate = () => {
  if (typeof window !== undefined && window.ga) {
    window.ga('set', 'page', window.location.pathname + window.location.search);
    window.ga('send', 'pageview');
  }
}

hydrate(
  <Router basename={window.rootUrl || '/'} onUpdate={onUpdate} >
    <App />
  </Router>,
  document.getElementById('react-root')
);
