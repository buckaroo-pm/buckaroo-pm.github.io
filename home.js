import React from 'react';
import { Link } from 'react-router-dom';

import postSummary from './components/postSummary';

export default props => (
  <>
  <div className="home-logo-container">
    <img src="/img/logo-medium.png" alt="Buckaroo" className="home-logo" />
  </div>
  <div className="page mt-4 ph-1">
    <div className="content">
      <h1>C/C++ Package Manager</h1>
      <p>Buckaroo is a package manager for C/C++. Buckaroo makes it easy to add modules to your project in a controlled and cross-platform way. </p>
      <p>💡 <a href="https://github.com/LoopPerfect/buckaroo">Learn More</a></p>
      <h1 className="mt-4">Recent Posts</h1>
      {
        (props.pages || [])
          .sort((x, y) => y.meta.created.localeCompare(x.meta.created))
          .slice(0, 3)
          .map((x, i) => (<div key={i}>{postSummary(x)}</div>))
      }
    </div>
  </div>
  </>
);
