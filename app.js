import React from 'react';
import {Route, Link} from 'react-router-dom'
import pages from './pages'
import { hot } from 'react-hot-loader';

const App = () => (
  <div>
    <div> Headers </div>
    {pages.map(v => <Route key={v.path} {...v} /> )}
    {pages.map(v => <Link to={v.path} key={v.path}>{v.path}</Link>)}
    <div> Footer </div>
  </div>
)

export default hot(module)(App);
